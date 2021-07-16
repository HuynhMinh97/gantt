import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AitAppUtils } from '../../utils/ait-utils';


@Component({
  selector: 'ait-back-button',
  templateUrl: 'ait-back-button.component.html',
  styleUrls: ['./ait-back-button.component.scss']
})

export class AitBackButtonComponent {
  isHide = true;
  isChangeColor = false;
  colorIcon = '#fff';
  backgroundBtn = null;
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

          // console.group( 'NavigationStart Event' );
          // Every navigation sequence is given a unique ID. Even "popstate"
          // navigations are really just "roll forward" navigations that get
          // a new, unique ID.
          // // // console.log( 'navigation id:', event.id );
          // // // console.log( 'route:', event.url );
          // The "navigationTrigger" will be one of:
          // --
          // - imperative (ie, user clicked a link).
          // - popstate (ie, browser controlled change such as Back button).
          // - hashchange
          // --
          // NOTE: I am not sure what triggers the "hashchange" type.
          // // // console.log( 'trigger:', event.navigationTrigger );

          // This "restoredState" property is defined when the navigation
          // event is triggered by a "popstate" event (ex, back / forward
          // buttons). It will contain the ID of the earlier navigation event
          // to which the browser is returning.
          // --
          // CAUTION: This ID may not be part of the current page rendering.
          // This value is pulled out of the browser; and, may exist across
          // page refreshes.
          const n = AitAppUtils.getParamsOnUrl();
          const m = AitAppUtils.getParamsOnUrl(true);
          const j = location.hash;

          this.isHide =  j.includes('job/new') || m.length > 30;
          this.isChangeColor =
            n.includes('sign') || n.includes('change-password') || n.includes('user-setting') || n.includes('sync-pe-api-setting') ||
            n.includes('sync-pe-api-history') || n.includes('new') || n.includes('job') || n.includes('company-basic-info')
            || n.includes('user-basic-info') || n.includes('user-certificate-info');
          this.setColorBtn();

          // console.groupEnd();

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
