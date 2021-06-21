/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbIconLibraries } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { AitTranslationService } from '../../services';
import { AitLayoutService } from '../../services/common/ait-layout.service';
import { AppState, getCaption } from '../../state/selectors';


@Component({
  selector: 'ait-menu-actions',
  templateUrl: './ait-menu-actions.component.html',
  styleUrls: ['./ait-menu-actions.component.scss']
})
export class AitMenuActionsComponent implements OnInit {
  constructor(
    private layoutService: AitLayoutService,
    private translateService: AitTranslationService,
    private store: Store<AppState>,
    private router: Router,
    private iconLibraries: NbIconLibraries
  ) {
    this.iconLibraries.registerFontPack('font-awesome', { packClass: 'far', iconClassPrefix: 'fa' });
  }
  buttons = [];
  @Input() menu_actions: any[] = [];
  ngOnInit() {
    if (!this.menu_actions) {
      this.menu_actions = []
    }
    this.store.pipe(select(getCaption)).subscribe(() => {
      const target: any = [
        ...this.menu_actions

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
              ...obj
            }
          }
        }
        return m
      })
    })
  }

  navigate = (link: string) => this.router.navigate([link]);

}
