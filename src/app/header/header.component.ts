import { Component } from '@angular/core';
import { CommonServiceService } from '../common-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private commonService: CommonServiceService, private router: Router) {
    this.commonService.checkAndNavigate()
  }

  logout(){
    localStorage.clear();
    this.router.navigate([''])
  }
}
