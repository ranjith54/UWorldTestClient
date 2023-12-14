import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CamDialogComponent } from '../cam-dialog/cam-dialog.component';
import { WebcamImage } from 'ngx-webcam';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  firstName? :string;
  lastName?: string;
  password?: string;
  hide = true;
  photoUploadSucces?: boolean;
  uploadedImages?: string[];

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
    }).afterClosed().subscribe((res: WebcamImage[]) => {
      if(res.length === 3) {
        res.forEach(image => {
          this.uploadedImages?.push(image.imageAsDataUrl);
        });
        this.photoUploadSucces = true;
      }
    })
  }

  onClickSignIn() {
    let registerObject: any = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email.value,
      password: this.password,
      images: this.uploadedImages
    }
    console.log(registerObject)
  }
  clearPhotos() {
    this.photoUploadSucces = false;
    this.uploadedImages = []
  }
}
