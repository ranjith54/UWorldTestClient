import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CamDialogComponent } from '../cam-dialog/cam-dialog.component';
import { WebcamImage } from 'ngx-webcam';
import { CommonServiceService } from '../common-service.service';
import { Router } from '@angular/router';

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
  uploadedImages?: string[] =[];
  errorMessage?: string;

  constructor(public dialog: MatDialog, private commonService: CommonServiceService,
    private router: Router) {
      this.commonService.checkAndNavigate()
    }
  
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
        res.forEach(item => {
          this.uploadedImages?.push(item.imageAsDataUrl);
        });
        this.photoUploadSucces = true;
      }
    })
  }

  onClickSignIn() {
    if(this.firstName && this.lastName && this.email.valid && this.password && this.uploadedImages) {
      let registerObject: any = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email.value,
        password: this.password,
        images: this.uploadedImages
      }
      this.commonService.registerUser(registerObject).subscribe(result => {
        if(result) {
          this.router.navigate(['/login'])
        }
      })
    }
    else {
      this.errorMessage = 'Please provide all details'
    }
  }
  clearPhotos() {
    this.photoUploadSucces = false;
    this.uploadedImages = []
  }
}
