/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ViewCell } from 'ng2-smart-table';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState, getCaption, getUserSetting } from '../../state/selectors';
import { isArrayFull, isNil, isObjectFull, KEYS, KeyValueDto } from '@ait/shared';
import { AitNumberFormatPipe } from '../../@theme/pipes/ait-number-format.pipe';
import { AitTranslationService } from '../../services/common/ait-translate.service';
import dayjs from 'dayjs';

@Component({
  selector: 'ait-ait-table-cell',
  templateUrl: './ait-table-cell.component.html',
  styleUrls: ['./ait-table-cell.component.scss'],
})
export class AitTableCellComponent implements OnInit, ViewCell {
  @Input() public value: any;
  @Input() rowData: any;
  @Output() navigate: EventEmitter<any> = new EventEmitter();

  setting: any;
  style: any;
  comma = '';
  text = '';
  companyName = '';
  isLink = false;
  constructor(
    public store: Store<AppState>,
    private numberFormatService: AitNumberFormatPipe,
    translateService: AitTranslationService
  ) {
    store.pipe(select(getUserSetting)).subscribe((setting) => {
      if (isObjectFull(setting)) {
        this.setting = setting;
      }
    });

    store.pipe(select(getCaption)).subscribe(() => {
      const result = translateService.translate('s_0001');
      if (result && result !== 's_0001') {
        this.comma = result;
      }
    });
  }
  

  ngOnInit(): void {
    this.setupData();
  }
  setupData() {
    if (this.value.type === 'master' && this.value.text) {
      const data = this.value.text;
      if (isArrayFull(data)) {
        const result = [];
        data.forEach((element: KeyValueDto) => {
          result.push(element?.value ?? '');
        });
        this.text = result.join(this.comma || '、');
      } else if (isObjectFull(data)) {
        this.text = data?.value ?? '';
      } else {
        this.text = '';
      }
    } else if (this.value.type === 'money' && this.value.text) {
      const result = this.numberFormatService.transform(this.value.text);
      this.text = result + '円';
    } else if (this.value.type === 'array' && this.value.text) {
      const data = this.value.text;
      if (isArrayFull(data)) {
        const result = [];
        data.forEach((item: string) => {
          result.push(item);
        });
        this.text = result.join(this.comma || '、');
      } else {
        this.text = '';
      }
    } else if (this.value.type === 'link' && this.value.text && this.value.name) {
      this.text = (this.value.text.length || '0');
      this.isLink = true;
      if (+this.text > 0) {
        this.companyName = (this.value.name || '');
      } else {
        this.companyName = KEYS.CUSTOM;
      }
    } else {
      this.text = this.value.text;
    }
    this.style = this.value.style || {};
    if (!isNil(this.style?.width)) {
      this.style.width = +this.style.width - 21 + 'px';
    }
  }

  navigateToJobList() {
    this.navigate.emit(this.companyName);
  }
}
