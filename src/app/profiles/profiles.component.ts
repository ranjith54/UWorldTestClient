import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent {
  userName :any = ''
  constructor(private route: Router){   
  }

  ngOnInit() {
    let userdetails:any = localStorage.getItem('userDetails')
    userdetails = JSON.parse(userdetails)
    this.userName = userdetails?.firstName +" "+ userdetails?.lastName;
    console.log(this.userName)

  }

  onClick() {
    this.route.navigate(['./home'])
  }
}
