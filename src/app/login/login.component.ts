import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CommonServiceService } from '../common-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  hide = true;
  password?: string
  constructor(private commonService: CommonServiceService, private router: Router) {
    this.commonService.checkAndNavigate()
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  login() {
    if(this.email.valid && this.password && this.email.value) {
      let EncryptedPassword = this.commonService.Encrypt(this.password);
      let Decrypted = this.commonService.Decrypt(EncryptedPassword)
      this.commonService.getUserDeatils(this.email.value, EncryptedPassword).subscribe(result => {
        localStorage.setItem('userDetails', JSON.stringify(result))
        this.router.navigate(['./profiles'])
      })
    }
  }

  redirect () {
    this.router.navigate(['./register'])
  }
}
