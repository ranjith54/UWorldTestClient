import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

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

  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };

  constructor(
    public dialogRef: MatDialogRef<CamDialogComponent>,
    public dialog: MatDialog) {

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
  }

  public savePhotos() {
    this.dialogRef.close(this.picturesTaken);
  }
}
