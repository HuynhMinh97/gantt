/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TabView } from '../../@constant';

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
  tabs : TabView[] = [

  ]

  selectTab = (type) => {
    if (!this.disabled) {
      this.tabSelected = type;
      this.onTabSelect.emit({ value: type });
    }
  }

  ngOnInit() {
    if (!this.tabSelected) {
      this.tabSelected = this.tabs[0]?.type
    }
  }
}


