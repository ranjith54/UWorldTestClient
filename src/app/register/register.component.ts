import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CamDialogComponent } from '../cam-dialog/cam-dialog.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  hide = true;

  constructor(public dialog: MatDialog) {}
  
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  openCameraDialog(){
    this.dialog.open(CamDialogComponent, {
      width: '700px',
      height: '700px',
      disableClose: true
    }).afterClosed().subscribe(res => {
      console.log(res)
    })
  }
}
