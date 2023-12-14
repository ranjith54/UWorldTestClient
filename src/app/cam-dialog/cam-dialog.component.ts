import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import * as faceapi from 'face-api.js';
import { CommonServiceService } from '../common-service.service';

@Component({
  selector: 'app-cam-dialog',
  templateUrl: './cam-dialog.component.html',
  styleUrls: ['./cam-dialog.component.scss']
})
export class CamDialogComponent {

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  public picturesTaken: WebcamImage[] = [];

  public imageMessage: string ='ji';

  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  public showWebcam = true;
  public deviceId?: string;
  public errors: WebcamInitError[] = [];
  errorMessage?: string;

  @ViewChild('image0') public image1?: ElementRef;
  @ViewChild('image1') public image2?: ElementRef;
  @ViewChild('image2') public image3?: ElementRef;

  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };

  constructor(private el: ElementRef,
    public dialogRef: MatDialogRef<CamDialogComponent>,
    public dialog: MatDialog, private commonService: CommonServiceService) {

  }

  async ngOnInit() {
    await Promise.all(
    [faceapi.nets.tinyFaceDetector.loadFromUri('../../assets/models'),
    await faceapi.nets.faceLandmark68Net.loadFromUri('../../assets/models'),
    await faceapi.nets.faceRecognitionNet.loadFromUri('../../assets/models'),
    await faceapi.nets.faceExpressionNet.loadFromUri('../../assets/models'),
    await faceapi.nets.ssdMobilenetv1.loadFromUri('../../assets/models'),
  ]).then(() => console.log("loaded")); 
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.picturesTaken.push(webcamImage);
  }
  
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }
  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public triggerSnapshot() {
    this.trigger.next();
  }

  public clearTakenPhotos() {
    this.picturesTaken = []
    this.errorMessage = ''
  }

  public async savePhotos() {
    this.commonService.registerUser('message')
    if(this.picturesTaken.length === 3) {
      this.errorMessage = ''
      let image1Input = this.image1?.nativeElement;
      let image2Input = this.image2?.nativeElement;
      let image3Input = this.image3?.nativeElement;
      let firstImageFaceDetection;
      let secondImageFaceDetection;
      let thirdImageFaceDetection;
      if(image1Input) {
        firstImageFaceDetection = await faceapi.detectSingleFace(image1Input, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
      }
      if(image2Input) {
        secondImageFaceDetection = await faceapi.detectSingleFace(image2Input, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
        console.log(secondImageFaceDetection)
      }
      if(image3Input) {
        thirdImageFaceDetection = await faceapi.detectSingleFace(image3Input, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
        console.log(thirdImageFaceDetection)
      }

      if(firstImageFaceDetection && secondImageFaceDetection && thirdImageFaceDetection){
        // Using Euclidean distance to comapare face descriptions
        let E1Distance = faceapi.euclideanDistance(firstImageFaceDetection.descriptor, secondImageFaceDetection.descriptor);
        let E2Distance = faceapi.euclideanDistance(firstImageFaceDetection.descriptor, thirdImageFaceDetection.descriptor);
        if(E1Distance <= 0.6 && E2Distance <= 0.6){
          //DB Call and Dialog Close
          this.dialogRef.close(this.picturesTaken);
        }
        else {
          this.errorMessage = 'Your Pictures are not matched. Please Try again'
        }
      } else {
        this.errorMessage = 'You face is not captued in any one of the picture. Please clear and try again!'
      }
    }
    else {
      this.errorMessage = 'Please Capture atleast 3 Photos';
    }
  }

  getImageMessage(): string {
    if(this.picturesTaken.length === 0){
      return 'Please Capture you front face!';
    }
    if(this.picturesTaken.length === 1) {
      return 'Please turn your face left slightly!';
    }
    if(this.picturesTaken.length == 2) {
      return 'Please turn your face right slightly!';
    }
    if(this.picturesTaken.length == 3) {
      return 'All Done Thank you!'
    }
    return 'Hi Plase Take your picture here.'
  }

  removePhoto(index: number) {
    console.log('called')
  }
}
