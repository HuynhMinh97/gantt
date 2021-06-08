import { DarkScreen } from '@ait/ui';
import { Component } from '@angular/core';
import { AitLayoutService } from 'libs/ui/src/lib/services/common/ait-layout.service';
import { MENU_USER } from './@constants';

@Component({
  selector: 'ait-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ait-matching-webapp';
  excludeScreens = DarkScreen;
  constructor(layoutService: AitLayoutService) {
    layoutService.menuUserInput = MENU_USER;
  }
}
