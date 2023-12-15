import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as faceapi from 'face-api.js';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';
import { Router } from '@angular/router';

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

  userImage?: string;
  interval: any;
  video$?: Promise<MediaStream>;
  audioContext?: AudioContext;
  analyser?: AnalyserNode;
  dataArray?: Uint8Array;
  rmsValue: number = 0;
  warningCount: number = 5;

  @ViewChild('image1') public image1?: ElementRef;

  constructor(private elRef: ElementRef, public dialog: MatDialog, public dialogRef: MatDialogRef<VideoTrackingComponent>, public route: Router) {
    let userData = localStorage.getItem('userDetails');
    if (userData)
      this.userImage = JSON.parse(userData).images[0];
  }

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
    // Create an audio context
    this.audioContext = new (window.AudioContext || window.AudioContext)();

    // Create an analyser node
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256; // Adjust as needed

    // Create a Uint8Array to hold the frequency data
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);


    this.videoInput = this.video?.nativeElement;
    const constraints = { audio: true, video: { facingMode: "user", video: { frameRate: { ideal: 10, max: 15 } } } }
    this.video$ = navigator.mediaDevices.getUserMedia(constraints)
    this.video$.then((stream) => {
      this.videoInput.srcObject = stream;
      const audioTrack = stream.getAudioTracks()[0];

      // Create a new media stream with only the audio track
      const audioStream = new MediaStream([audioTrack]);

      // Connect the audio stream to the audio context
      const source = this.audioContext?.createMediaStreamSource(audioStream);
      if(this.analyser)
        source?.connect(this.analyser);
      this.processAudio()
    });
    this.detectFaces()
  }
  processAudio() {
    
    // Function to process audio data and update RMS value
    const calculateRMS = () => {
      // Get frequency data
      if(this.dataArray)
        this.analyser?.getByteFrequencyData(this.dataArray);

      // Calculate RMS value
      if(this.dataArray){
        const rms = Math.sqrt(
          this.dataArray?.reduce((acc, val) => acc + val * val, 0) / this.dataArray?.length
        );
        this.rmsValue = rms;
        if(this.rmsValue > 70){
          console.log(this.rmsValue)
        }

      }
      // Update RMS value


      // Call the function again on the next animation frame
      requestAnimationFrame(calculateRMS);
    };

    // Start the calculation
    calculateRMS();
  }

  async detectFaces() {
    this.elRef.nativeElement.querySelector('video').addEventListener('play', async () => {
      // this.canvas = await faceapi.createCanvasFromMedia(this.videoInput);

      // this.canvasEl = this.canvasRef?.nativeElement;
      // this.canvasEl.appendChild(this.canvas);
      // this.canvas.setAttribute('id', 'canvass');
      // this.canvas.setAttribute(
      //   'style', `position: fixed;
      //   top:0; left: 0`
      // );
      this.displaySize = {
        width: this.videoInput.width,
        height: this.videoInput.height
      }

      // faceapi.matchDimensions(this.canvas, this.displaySize);
      this.interval = setInterval(async () => {
        this.detection = await faceapi.detectAllFaces(this.videoInput,
          new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withAgeAndGender().withFaceExpressions();
        this.resizedDetections = faceapi.resizeResults(
          this.detection,
          this.displaySize
        );
        console.log(this.detection)
        let face: any = await faceapi.detectSingleFace(this.videoInput, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withFaceDescriptor();
        let existingFace: any = await faceapi.detectSingleFace(this.image1?.nativeElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withFaceDescriptor();

        let EDistance;
        if (face && existingFace) {
          EDistance = faceapi.euclideanDistance(face.descriptor, existingFace.descriptor);
        }
        if (EDistance && EDistance > 0.6) {
          if (!this.haveWarning) {
            this.sendWarning('You are not an Authenticated User!')
          }
        }

        if (this.detection.length == 0) {
          if (!this.haveWarning) {
            this.sendWarning('Please align your face with the camera and make sure you are alone while taking the test.');
          }
        }

        if (this.detection.length > 1) {
          if (!this.haveWarning) {
            this.sendWarning('Please align your face with the camera and make sure you are alone while taking the test.');
          }
        }
        // this.canvas.getContext('2d').clearRect(
        //   0, 0, this.canvas.width, this.canvas.height
        // );
        //faceapi.draw.drawDetections(this.canvas, this.resizedDetections);
        //faceapi.draw.drawFaceLandmarks(this.canvas, this.resizedDetections);
      }, 2000)
    })
  }

  sendWarning(data: any) {
    if(this.warningCount>0){
      this.haveWarning = true
    this.dialog.open(WarningDialogComponent, {
      width: '450px',
      disableClose: true,
      data: {
        message: data,
        count: this.warningCount
      }
    }).afterClosed().subscribe(result => {
      this.haveWarning = false;
      this.warningCount--
    })
    }
    else {
      this.dialogRef.close();
      this.route.navigate(['./home'])
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.videoInput.srcObject = null;
    this.video$?.then((stream) => {
      this.videoInput.srcObject = stream;
      const tracks = stream.getTracks();
      // ...
      // When you want to stop the video:
      tracks.forEach((track) => track.stop());
    });
  }
}
