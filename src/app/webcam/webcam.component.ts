import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';
import {CdkDrag} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss']
})
export class WebcamComponent implements OnInit {
  WIDTH = 440;
  HEIGHT = 280;
  @ViewChild('image1',{ static: true })
  public image1?: ElementRef;
  @ViewChild('image2',{ static: true })
  public image2?: ElementRef;

  @ViewChild('video', { static: true })
  public video?: ElementRef;
  @ViewChild('canvas', { static: true })
  public canvasRef?: ElementRef;

  image1Input: any;
  image2Input: any;
  EDistance?: any;
  message: any = '';

  constructor(private elRef: ElementRef) {}

  stream: any;
  detection: any;
  resizedDetections: any;
  canvas: any;
  canvasEl: any;
  displaySize: any;
  videoInput: any;

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
          new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
          this.resizedDetections = faceapi.resizeResults(
            this.detection,
            this.displaySize
          );
          if(this.detection){
            this.sendWarning()
          }
          this.canvas.getContext('2d').clearRect(
            0,0,this.canvas.width, this.canvas.height
          );
          faceapi.draw.drawDetections(this.canvas, this.resizedDetections);
          faceapi.draw.drawFaceLandmarks(this.canvas, this.resizedDetections);
      }, 100)
    })
  }

  sendWarning() {

  }

  public async detect() {
    console.log('clicked')
    // this.image1Input = this.image1?.nativeElement;
    // this.image2Input = this.image2?.nativeElement
    // const firstImageFaceDetection = await faceapi.detectSingleFace(this.image1Input, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withFaceDescriptor();
    // console.log(firstImageFaceDetection)

    // const secondImageFaceDetection = await faceapi.detectSingleFace(this.image2Input, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withFaceDescriptor();
    // console.log(secondImageFaceDetection)

    // if (firstImageFaceDetection) {
    //   const { x, y, width, height } = firstImageFaceDetection.detection.box;
    //   this.renderFace(this.image1Input, x, y, width, height);
    // }

    // if (secondImageFaceDetection) {
    //   const { x, y, width, height } = secondImageFaceDetection.detection.box;
    //   this.renderFace(this.image2Input, x, y, width, height);
    // }

    // if(firstImageFaceDetection && secondImageFaceDetection){
    //   // Using Euclidean distance to comapare face descriptions
    //   this.EDistance = faceapi.euclideanDistance(firstImageFaceDetection.descriptor, secondImageFaceDetection.descriptor);
    //   console.log(this.EDistance);
    //   if(this.EDistance <= 0.5){
    //     console.log('matched')
    //     this.message = 'Matched';
    //   }
    //   else {
    //     this.message = 'Not Matched';
    //   }
    // }
  }

  renderFace(image: any, x:any, y: any, width: any, height: any) {
    const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");

      context?.drawImage(image, x, y, width, height, 0, 0, width, height);
      canvas.toBlob((blob: any) => {
        image.src = URL.createObjectURL(blob);
      }, "image/jpeg");
  }

}
