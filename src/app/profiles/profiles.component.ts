import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent {
  constructor(private route: Router){}

  onClick() {
    this.route.navigate(['./home'])
  }
}
