import { Component } from '@angular/core';

@Component({
  selector: 'app-test-interface',
  templateUrl: './test-interface.component.html',
  styleUrls: ['./test-interface.component.scss']
})
export class TestInterfaceComponent {
  tempOptions = ["Facebook", "Google", "Twitter", "Microsoft"]
  questionsNumberList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
}
