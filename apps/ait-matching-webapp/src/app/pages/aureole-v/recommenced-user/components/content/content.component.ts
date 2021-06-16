import { Component, Input, OnInit } from '@angular/core';

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

export class ContentRowComponent implements OnInit {
  rowData: any;
  columnData: any;
  @Input() data;
  constructor() { }

  ngOnInit() {
    // // console.log(this.rowData, this.columnData);
  }
}
