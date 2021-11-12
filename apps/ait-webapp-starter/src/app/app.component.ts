import { AitBaseComponent, DarkScreen } from '@ait/ui';
import { Component, HostListener, OnInit } from '@angular/core';
import { MENU_ITEMS } from './app.menus';

@Component({
  selector: 'ait-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends AitBaseComponent implements OnInit {
  excludeScreens = DarkScreen; // Please insert into here which screens need to hide the header bar
  menu = MENU_ITEMS

  ngOnInit() {
    this.initBaseComponent();
  }

  @HostListener('window:unload', [ '$event' ])
  unloadHandler() {
    console.log(2);
    if (!localStorage.getItem('isRemember')) {

      localStorage.removeItem('refresh_token');
      localStorage.removeItem('access_token');
    }
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHandler() {
    console.log(1);
    if (!localStorage.getItem('isRemember')) {
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('access_token');
    }
  }
}
