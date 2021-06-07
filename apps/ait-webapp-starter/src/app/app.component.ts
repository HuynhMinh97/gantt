import { DarkScreen } from '@ait/ui';
import { Component } from '@angular/core';
import { MENU_ITEMS } from './app.menus';

@Component({
  selector: 'ait-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  excludeScreens = DarkScreen; // Please insert into here which screens need to hide the header bar
  menu = MENU_ITEMS
}
