import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router
  ) { }
  buttons = [];
  ngOnInit() {
    this.store.pipe(select(getCaption)).subscribe(() => {
      this.buttons = this.layoutService.MENU_ACTIONS.map(m => {
        if (m.isI18n) {
          return {
            ...m,
            title: this.translateService.translate(m.title)
          }
        }
        return m
      })
    })
  }

  navigate = (link: string) => this.router.navigate([link]);

}
