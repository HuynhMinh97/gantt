/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';
@Component({
  selector: 'ait-content-row',
  template: `
  <div class="row__td__table" [nbTooltip]="'詳しくはこちらをクリック'"><span>{{rowData?.create_by}}</span></div>
  `,
  styles: [
    `
      .row__td__table {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      &.date {
        justify-content: center;
        span {
          text-align: center !important;
        }
      }
    }
    `,
  ],
})

export class ContentRowComponent {
  rowData: any;
  columnData: any;
  @Input() data: any;
}
