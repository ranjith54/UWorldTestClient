import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';

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
  ]).then(() => console.log("loaded")); 
  }

  public async detect() {
    console.log('clicked')
    this.image1Input = this.image1?.nativeElement;
    this.image2Input = this.image2?.nativeElement
    const firstImageFaceDetection = await faceapi.detectSingleFace(this.image1Input, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
    console.log(firstImageFaceDetection)

    const secondImageFaceDetection = await faceapi.detectSingleFace(this.image2Input, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
    console.log(secondImageFaceDetection)

    if (firstImageFaceDetection) {
      const { x, y, width, height } = firstImageFaceDetection.detection.box;
      this.renderFace(this.image1Input, x, y, width, height);
    }

    if (secondImageFaceDetection) {
      const { x, y, width, height } = secondImageFaceDetection.detection.box;
      this.renderFace(this.image2Input, x, y, width, height);
    }

    if(firstImageFaceDetection && secondImageFaceDetection){
      // Using Euclidean distance to comapare face descriptions
      this.EDistance = faceapi.euclideanDistance(firstImageFaceDetection.descriptor, secondImageFaceDetection.descriptor);
      console.log(this.EDistance);
      if(this.EDistance <= 0.5){
        console.log('matched')
        this.message = 'Matched';
      }
      else {
        this.message = 'Not Matched';
      }
    }
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
