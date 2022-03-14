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
      // console.log(e.target.scrollTop)
      if (e.target.scrollTop > 10) {
        this.isHide = false;
      }
      else {
        this.isHide = true;
      }
    })
    // console.log()
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

          // console.group('NavigationStart Event');
          // Every navigation sequence is given a unique ID. Even "popstate"
          // navigations are really just "roll forward" navigations that get
          // a new, unique ID.
          // // console.log( 'navigation id:', event.id );
          // // console.log( 'route:', event.url );
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

          // this.isChangeColor = DarkScreen.includes(n);
          ;

          this.setColorBtn();

          // console.groupEnd();

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
