import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VideoTrackingComponent } from '../video-tracking/video-tracking.component';

@Component({
  selector: 'app-test-interface',
  templateUrl: './test-interface.component.html',
  styleUrls: ['./test-interface.component.scss']
})
export class TestInterfaceComponent {
  tempOptions = ["Facebook", "Google", "Twitter", "Microsoft"]
  questionsNumberList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(public dialog: MatDialog) {
    this.dialog.open(VideoTrackingComponent, {
      height: '200px',
      width: '200px',
      disableClose: true,
      hasBackdrop: false,
      position: {
        bottom: '60px',
        left: '30px'
      }
    })
  }
}
