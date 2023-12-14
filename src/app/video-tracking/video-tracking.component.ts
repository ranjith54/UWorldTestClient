import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as faceapi from 'face-api.js';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';

@Component({
  selector: 'app-video-tracking',
  templateUrl: './video-tracking.component.html',
  styleUrls: ['./video-tracking.component.scss']
})
export class VideoTrackingComponent {
  WIDTH = 250;
  HEIGHT = 200;
  @ViewChild('video', { static: true })
  public video?: ElementRef;
  @ViewChild('canvas', { static: true })
  public canvasRef?: ElementRef;

  constructor(private elRef: ElementRef, public dialog: MatDialog) {}

  stream: any;
  detection: any;
  resizedDetections: any;
  canvas: any;
  canvasEl: any;
  displaySize: any;
  videoInput: any;

  haveWarning: boolean = false;

  async ngOnInit() {
    await Promise.all(
    [faceapi.nets.tinyFaceDetector.loadFromUri('../../assets/models'),
    await faceapi.nets.faceLandmark68Net.loadFromUri('../../assets/models'),
    await faceapi.nets.faceRecognitionNet.loadFromUri('../../assets/models'),
    await faceapi.nets.faceExpressionNet.loadFromUri('../../assets/models'),
    await faceapi.nets.ssdMobilenetv1.loadFromUri('../../assets/models'),
    await faceapi.nets.ageGenderNet.loadFromUri('../../assets/models')
  ]).then(() => this.startVideo()); 
  }

  startVideo() {
    this.videoInput = this.video?.nativeElement;
    const constraints={ audio: false, video: { facingMode: "user" ,video: { frameRate: { ideal: 10, max: 15 } }} }
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      this.videoInput.srcObject = stream
    });
    this.detectFaces()
  }

  async detectFaces() {
    this.elRef.nativeElement.querySelector('video').addEventListener('play', async () => {
      this.canvas = await faceapi.createCanvasFromMedia(this.videoInput);

      this.canvasEl = this.canvasRef?.nativeElement;
      this.canvasEl.appendChild(this.canvas);
      this.canvas.setAttribute('id', 'canvass');
      this.canvas.setAttribute(
        'style', `position: fixed;
        top:0; left: 0`
      );
      this.displaySize = {
        width: this.videoInput.width,
        height: this.videoInput.height
      }

      faceapi.matchDimensions(this.canvas, this.displaySize);
      setInterval(async () => {
        this.detection = await faceapi.detectAllFaces(this.videoInput,
          new faceapi.TinyFaceDetectorOptions()).withAgeAndGender().withFaceExpressions();
          this.resizedDetections = faceapi.resizeResults(
            this.detection,
            this.displaySize
          );
          console.log(this.detection)
          if(this.detection.length !== 1){
            if(!this.haveWarning){
              this.sendWarning(this.detection)
            }
          }
          this.canvas.getContext('2d').clearRect(
            0,0,this.canvas.width, this.canvas.height
          );
          //faceapi.draw.drawDetections(this.canvas, this.resizedDetections);
          //faceapi.draw.drawFaceLandmarks(this.canvas, this.resizedDetections);
      }, 1000)
    })
  }
  
  sendWarning(data: any) {
    this.haveWarning = true
    this.dialog.open(WarningDialogComponent, {
      width: '450px',
      disableClose: true
    }).afterClosed().subscribe(result => {
        this.haveWarning = false;
    })
  }
}
