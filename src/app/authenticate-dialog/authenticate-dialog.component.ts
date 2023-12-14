import { Component, ElementRef, ViewChild } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import * as faceapi from 'face-api.js';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-authenticate-dialog',
  templateUrl: './authenticate-dialog.component.html',
  styleUrls: ['./authenticate-dialog.component.scss']
})
export class AuthenticateDialogComponent {
  private trigger: Subject<void> = new Subject<void>();
  public picturesTaken?: WebcamImage;
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  public deviceId?: string;
  public errors: WebcamInitError[] = [];
  errorMessage: string = ''

  userImageDateUrls?: string;
  @ViewChild('image1') public image1?: ElementRef;
  @ViewChild('image2') public image2?: ElementRef;

  constructor(public dialogRef: MatDialogRef<AuthenticateDialogComponent>,
    public dialog: MatDialog) {
    let userData = localStorage.getItem('userDetails');
    if(userData) {
      this.userImageDateUrls = JSON.parse(userData).images[0];
      console.log(this.userImageDateUrls)
    }
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

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.picturesTaken = webcamImage;
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
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
    setTimeout(() => {
      this.authenticate()
    }, 1000);
  }

  private async authenticate() {
    if(this.picturesTaken) {
      this.errorMessage = ''
      let image1Input = this.image1?.nativeElement;
      let image2Input = this.image2?.nativeElement;
      let firstImageFaceDetection;
      let secondImageFaceDetection;
      if(image1Input) {
        firstImageFaceDetection = await faceapi.detectSingleFace(image1Input, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
      }
      if(image2Input) {
        secondImageFaceDetection = await faceapi.detectSingleFace(image2Input, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
      }

      if(firstImageFaceDetection && secondImageFaceDetection){
        let EDistance = faceapi.euclideanDistance(firstImageFaceDetection.descriptor, secondImageFaceDetection.descriptor);
        if(EDistance <= 0.6) {
          this.dialogRef.close(true)
        }
        else {
          this.errorMessage = 'Failed to Authenticate. Please try again !'
        }
      }
      else {
        this.errorMessage = 'Failed to Authenticate. Please try again !'
      }
    }
  }
}
