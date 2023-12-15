import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticateDialogComponent } from '../authenticate-dialog/authenticate-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonServiceService } from '../common-service.service';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent {
  
  isAuthenticated: boolean = false;
  assignmentId: number = 0;
  assignmentData: any;
  constructor(public dialog: MatDialog, private route: Router, private activedRoute: ActivatedRoute,
    private commonService: CommonServiceService
    ) {
    let tempAssignmentId = this.activedRoute.snapshot.paramMap.get('assignmentId');
    if(tempAssignmentId) {
      this.assignmentId = +tempAssignmentId;
    }
    else {
      this.assignmentId = 0;
    }

    this.commonService.getAssignmentsData().subscribe((result:any) => {
      this.assignmentData = result[this.assignmentId];
      console.log(this.assignmentData)
    })

  }

  public onClickAuthenticate() {
    this.dialog.open(AuthenticateDialogComponent, {
      height: '500px',
      width: '600px'
    }).afterClosed().subscribe(result => {
      if(result) {
        this.isAuthenticated = true;
      }
    })
  }

  startTest() {
    this.route.navigate([`./test-interface/${this.assignmentId}`])
  }
  back(){
    this.route.navigate([``])
  }
}
