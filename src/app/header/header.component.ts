import { Component } from '@angular/core';
import { CommonServiceService } from '../common-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']

})
export class HeaderComponent {
  userdetails: any;
  userName: string;
  constructor(private commonService: CommonServiceService, private router: Router) {
     this.userdetails = localStorage.getItem('userDetails')
     this.userdetails = JSON.parse(this.userdetails)
     this.userName = this.userdetails.firstName +" "+ this.userdetails.lastName     
    this.commonService.checkAndNavigate()
  }

  logout(){
    
    localStorage.clear();
    this.router.navigate([''])
  }
}
