import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticateDialogComponent } from '../authenticate-dialog/authenticate-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent {
  
  isAuthenticated: boolean = false;
  constructor(public dialog: MatDialog, private route: Router) {
    
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
    this.route.navigate(['./test-interface'])
  }
}
