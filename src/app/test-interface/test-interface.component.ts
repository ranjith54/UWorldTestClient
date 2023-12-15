import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VideoTrackingComponent } from '../video-tracking/video-tracking.component';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CommonServiceService } from '../common-service.service';

@Component({
  selector: 'app-test-interface',
  templateUrl: './test-interface.component.html',
  styleUrls: ['./test-interface.component.scss']
})
export class TestInterfaceComponent {
  tempOptions = ["Facebook", "Google", "Twitter", "Microsoft"]
  questionsNumberList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  questionsData: any;
  currentQuestionData: any;
  currentQuestionIndex = 0;
  display: any;
  videoDialogRef: any;

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private commonService: CommonServiceService, private router:Router) {
    let assignmentId = this.route.snapshot.paramMap.get('assignmentId');
    if(assignmentId) {
      this.loadAssigmentData(+assignmentId);
    }
    else {
      this.loadAssigmentData(0);
    }
    
    this.videoDialogRef = this.dialog.open(VideoTrackingComponent, {
      height: '200px',
      width: '200px',
      disableClose: true,
      hasBackdrop: false,
      position: {
        bottom: '60px',
        left: '30px'
      }
    })
  }
  close(){
    let userdetails = localStorage.getItem('userDetails');
    if(userdetails){
      this.videoDialogRef.close();
      this.router.navigate(['/home']) 
     }else{
      this.videoDialogRef.close();
      this.router.navigate(['']);
     }
  }
  loadAssigmentData(assignmentId: number) {
    this.commonService.getAssignmentsData().subscribe((result: any) => {
      console.log(result[assignmentId])
      this.questionsData = result[assignmentId].questions;
      console.log(this.questionsData)
      this.currentQuestionData = this.questionsData[this.currentQuestionIndex]
      this.startTimer(this.questionsData?.length)
    })
  }

  onClickPreviousQuestion() {
    if(this.currentQuestionIndex > 0){
      this.currentQuestionIndex = this.currentQuestionIndex - 1;
      this.currentQuestionData = this.questionsData[this.currentQuestionIndex];
      console.log(this.currentQuestionData)
    }
  }

  onClickNextQuestion() {
    if(this.currentQuestionIndex < this.questionsData.length-1){
      this.currentQuestionIndex = this.currentQuestionIndex + 1;
      this.currentQuestionData = this.questionsData[this.currentQuestionIndex]
    }
  }

  navigateQuestion(index: number) {
    this.currentQuestionIndex = index;
    this.currentQuestionData = this.questionsData[this.currentQuestionIndex];
  }

  startTimer(minute: number) {
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;
    const prefix = minute < 10 ? '0' : '';
    let timeInterval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        console.log('finished');
        clearInterval(timeInterval);
      }
    }, 1000)
  }

  submitTest() {
    this.videoDialogRef.close();
    this.router.navigate(['./home'])
  }
}
