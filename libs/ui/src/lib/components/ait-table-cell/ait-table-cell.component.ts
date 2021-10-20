/* eslint-disable @typescript-eslint/no-explicit-any */
import { ViewCell } from 'ng2-smart-table';
import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState, getCaption, getUserSetting } from '../../state/selectors';
import { isArrayFull, isNil, isObjectFull, KeyValueDto } from '@ait/shared';
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
  setting: any;
  comma = '';
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
  style: any;
  text = '';

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
        this.text = result.join((this.comma || ',') + ' ');
      } else if (isObjectFull(data)) {
        this.text = data?.value ?? '';
      } else {
        this.text = '';
      }
    } else if (this.value.type === 'money' && this.value.text) {
      const result = this.numberFormatService.transform(this.value.text);
      this.text = result + '円';
    } else if (this.value.type === 'date' && this.value.text) {
      const dateFormat = this.setting['date_format_display'];
      const result = dayjs(this.value.text).format(
        dateFormat.toUpperCase() + ' HH:mm'
      );
      this.text = result;
    } else {
      this.text = this.value.text;
    }
    this.style = this.value.style || {};
    if (!isNil(this.style?.width)) {
      this.style.width = +this.style.width - 21 + 'px';
    }
  }
}
