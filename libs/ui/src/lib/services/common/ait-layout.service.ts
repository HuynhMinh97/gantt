import { Injectable } from '@angular/core';
import { ACTION_HEADER, APP_LOGO, APP_TITLE, MENU_HEADER, MENU_USER } from '../../@constant';
import { Title } from '@angular/platform-browser';
import { AitTranslationService } from './ait-translate.service';
import { select, Store } from '@ngrx/store';
import { AppState, getCaption } from '../../state/selectors';
import { AitEnvironmentService } from '../ait-environment.service';

@Injectable({ providedIn: 'root' })
export class AitLayoutService {
  env: any = {};
  public menuUserInput = [];
  constructor(
    private translateService: AitTranslationService,
    private titleService: Title,
    private _env : AitEnvironmentService,
    private store: Store<AppState>) {
      this.env = _env;
      //APP TITLE
      store.pipe(select(getCaption)).subscribe(() => {
        titleService.setTitle(translateService.translate(APP_TITLE) + ' ' + this.env?.COMMON?.VERSION);
      })

  }


  get MENU_ACTIONS(): any[] {
    return ACTION_HEADER;
  }



  //LOGO APP
  get LOGO_APP(): string {
    return APP_LOGO;
  }

  // MENU HEADER
  get MENU_HEADER(): any[] {
    const menu = MENU_HEADER.map(item => {
      return {
        ...item,
        title: this.translateService.translate(item.title)
      }
    })
    return menu;
  }

  // MENU USER
  get MENU_USER(): any[] {
    const target = this.menuUserInput.length !== 0 ? this.menuUserInput : MENU_USER

    const menu = target.map(item => {
      return {
        header_title: this.translateService.translate(item.header_title),
        tabs: item.tabs.map(tab => ({
          ...tab,
          title: this.translateService.translate(tab.title),
        }))
      }
    })
    return menu;
  }

}

