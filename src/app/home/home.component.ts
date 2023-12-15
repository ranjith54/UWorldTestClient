import { Component } from '@angular/core';
import { CommonServiceService } from '../common-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  assignmentsData: any;

  constructor(private commonService: CommonServiceService, private route: Router){
    this.commonService.checkAndNavigate()
    this.getAssignmentData()
  }

  getAssignmentData () {
    this.commonService.getAssignmentsData().subscribe(result => {
      this.assignmentsData = result;
    })
  }

  startTest(assignmentId: number) {
    this.route.navigate([`./instructions/${assignmentId}`])
  }
}
