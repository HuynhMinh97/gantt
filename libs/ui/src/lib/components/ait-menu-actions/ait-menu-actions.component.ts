/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NbIconLibraries } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { AitTranslationService } from '../../services';
import { AitLayoutService } from '../../services/common/ait-layout.service';
import { AppState, getCaption, getLang } from '../../state/selectors';


@Component({
  selector: 'ait-menu-actions',
  templateUrl: './ait-menu-actions.component.html',
  styleUrls: ['./ait-menu-actions.component.scss']
})
export class AitMenuActionsComponent implements OnInit {
  screens = ['candidates', 'jobs', '/']
  currentScreen = '/';

  screenCurrent: BehaviorSubject<any> = new BehaviorSubject('/');
  constructor(
    private layoutService: AitLayoutService,
    private translateService: AitTranslationService,
    private store: Store<AppState>,
    private router: Router,
    private iconLibraries: NbIconLibraries
  ) {
    if (!localStorage.link) {
      localStorage.setItem('link', this.currentScreen);
    }
    else {
      this.currentScreen = localStorage.link;
    }
    this.iconLibraries.registerFontPack('font-awesome', { packClass: 'far', iconClassPrefix: 'fa' });
    if (!this.menu_actions) {
      this.menu_actions = []
    }

    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        if (location.hash.includes(this.screens[0])) {
          this.currentScreen = '/candidates';
          this.screenCurrent.next('/candidates')
        }
        else if (location.hash.includes(this.screens[1])) {
          this.currentScreen = '/jobs'
          this.screenCurrent.next('/jobs')

        }
        else if (location.hash === this.screens[2]) {
          this.currentScreen = '/';
          this.screenCurrent.next('/')

        }
        else {
          this.screenCurrent.next('/other');
        }

      }
    })


    this.store.pipe(select(getCaption)).subscribe(() => {
      this.applyButtons();
    })
  }
  buttons = [];
  @Input() menu_actions: any[] = [];

  ngOnInit() {
    this.applyButtons();
  }

  applyButtons = () => {
    this.screenCurrent.subscribe(val => {
      const target: any = [
        ...(this.menu_actions || [])

      ]
      this.buttons = target.map(m => {
        if (m.isI18n) {
          let obj = {}
          if (m.pack) {
            obj = { pack: m.pack }
          }

          return {
            ...m,
            title: this.translateService.translate(m.title),
            icon: {
              icon: m.icon,
              ...obj,
              status: m.link === val ? 'primary' : null
            }
          }
        }
        return m
      })
    })
  }

  swipeScreen = (link: string) => {
    this.currentScreen = link;
    this.screenCurrent.next(link);
    localStorage.setItem('link', link);
    this.buttons = this.buttons.map(b => ({ ...b, icon: { ...b.icon, status: null } }))
    const buts = this.buttons.find(b => b.link === link);
    if (buts) {
      buts.icon.status = 'primary';
    }
    this.navigate(this.currentScreen);

  }

  navigate = (link: string) => this.router.navigate([link]);

}
