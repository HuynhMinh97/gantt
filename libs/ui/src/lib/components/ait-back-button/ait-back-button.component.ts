import { Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AitAppUtils } from '../../utils/ait-utils';


@Component({
  selector: 'ait-back-button',
  templateUrl: 'ait-back-button.component.html',
  styleUrls: ['./ait-back-button.component.scss']
})

export class AitBackButtonComponent {
  isHide = false;
  isChangeColor = false;
  colorIcon = '#fff';
  backgroundBtn = null;
  @Input() tabIndex;
  constructor(
    router: Router,
  ) {

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

  back = () => {
    history.back()
  }

}
