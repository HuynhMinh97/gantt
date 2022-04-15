import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NbLayoutScrollService } from '@nebular/theme';
import { filter } from 'rxjs/operators';
import { DarkScreen } from '../../@constant';
import { AitAppUtils } from '../../utils/ait-utils';

@Component({
  selector: 'ait-up-button',
  templateUrl: 'ait-up-button.component.html',
  styleUrls: ['./ait-up-button.component.scss']
})

export class AitUpButtonComponent {
  isChangeColor = false;
  colorIcon = '#fff';
  backgroundBtn = '';
  isHide = true;
  constructor(

    router: Router,
    private layoutScrollService: NbLayoutScrollService) {
    layoutScrollService.onScroll().subscribe(e => {
      if (e.target.scrollTop > 10) {
        this.isHide = false;
      }
      else {
        this.isHide = true;
      }
    })
    router.events
      .pipe(
        // The "events" stream contains all the navigation events. For this demo,
        // though, we only care about the NavigationStart event as it contains
        // information about what initiated the navigation sequence.
        filter(
          (event) => {

            return (event instanceof NavigationEnd);

          }
        )
      )
      .subscribe(
        () => {
          this.setColorBtn();
        }
      )

  }

  gotoTop() {
    this.layoutScrollService.scrollTo(0, 0);
  }

  setColorBtn = () => {
    if (this.isChangeColor) {
      this.colorIcon = '#10529d';
      this.backgroundBtn = '#EDF1F7'
    }
    else {
      this.colorIcon = '#fff';
      this.backgroundBtn = null;
    }
  }

}
