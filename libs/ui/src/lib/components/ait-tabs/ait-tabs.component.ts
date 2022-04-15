/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TabView } from '../../@constant';
import { AitTranslationService } from '../../services';
import { AppState, getCaption } from '../../state/selectors';

@Component({
  selector: 'ait-tabs',
  templateUrl: './ait-tabs.component.html',
  styleUrls: ['./ait-tabs.component.scss']
})
export class AitTabsCommonComponent implements OnInit {
  @Input() tabSelected;
  @Output() onTabSelect = new EventEmitter();
  @Input() isRE = false;
  @Input() countItemsRE = 0;
  @Input() disabled = false;
  @Input()
  tabs: TabView[] = [

  ]
  @Input() tabIndex;

  constructor(private translateService: AitTranslationService, store: Store<AppState>) {
    store.pipe(select(getCaption)).subscribe(() => {
      this.tabs = this.tabs.map(tab => {
        return {
          ...tab,
          title: translateService.translate(tab?.title)
        }
      })
    })
  }

  selectTab = (type) => {
    if (!this.disabled) {
      this.tabSelected = type;
      this.onTabSelect.emit({ value: type });
    }
  }

  ngOnInit() {
    this.tabs = this.tabs.map(tab => {
      return {
        ...tab,
        title: this.translateService.translate(tab?.title)
      }
    })
    if (!this.tabSelected) {
      this.tabSelected = this.tabs[0]?.type
    }
  }
}


