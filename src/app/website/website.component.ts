import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.scss']
})
export class WebsiteComponent {
  constructor(private router: Router){
  }
  ngOnInit(){
    let userdetails = localStorage.getItem('userDetails');
    if(userdetails){
      this.router.navigate(['/home']) 
     }
  }
  signup(){
    this.router.navigate(['/register'])  }

  login(){
    this.router.navigate(['/login'])
  }
}
