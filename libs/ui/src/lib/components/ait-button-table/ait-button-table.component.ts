import { KeyValueDto } from '@ait/shared';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
@Component({
  selector: 'ait-button-table',
  templateUrl: './ait-button-table.component.html',
  styleUrls: ['./ait-button-table.component.scss']
})
export class AitButtonTableComponent implements OnInit {

  @ViewChild('display', { static: false }) display: ElementRef;
  @Input() columnExport = [];
  @Input() dataExport: any[] = [];
  @Input() fileName = 'My Csv';

  @Input() columnAll: KeyValueDto[] = [];
  @Output()columnDislay = new EventEmitter();

  @Input() dataDelete: any = [];
  @Output() isDelete = new EventEmitter();
  isSetting = false;
  selectedItems = [];
  columns = [];
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.columns = this.columnAll;
    this.isDelete.emit({value: false});
    console.log(this.dataDelete);
    
  }

  exportCsv() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: false,
      showTitle: false,
      title: 'Your title',
      useBom: true,
      noDownload: false,
      headers: this.columnExport,
      useHeader: true,
      nullToEmptyString: true,
      // keys: this.columnExport,
    };
    if (this.dataExport.length > 0) {
      new AngularCsv(this.dataExport, this.fileName, options);
    } 
  }

  toggleSetting() {
    this.isSetting = !this.isSetting;
  }

  settingColumnTable(val: any[]) {
    this.columns = val;     
    this.columnDislay.emit({value: val});  
    console.log(val);
     
  }

  deletAll(){
    this.isDelete.emit({value: true});
  }

}
