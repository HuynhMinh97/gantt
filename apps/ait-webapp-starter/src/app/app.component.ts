import { DarkScreen } from '@ait/ui';
import { Component } from '@angular/core';

@Component({
  selector: 'ait-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  excludeScreens = DarkScreen; // Please insert into here which screens need to hide the header bar
}
