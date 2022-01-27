// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { isObjectFull, KeyValueDto } from '@ait/shared';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { AitTranslationService } from '../../services';
@Component({
  selector: 'ait-button-setting-table',
  templateUrl: './ait-button-setting-table.component.html',
  styleUrls: ['./ait-button-setting-table.component.scss']
})
export class AitButtonTableComponent implements OnInit,OnChanges {

  @ViewChild('display', { static: false }) display: ElementRef;
  @Input() columnExport = [];
  @Input() dataExport: any[] = [];
  @Input() fileName = 'My Csv';
  @Input() id = '';
  @Input() collection = 'sys_master_data';
  @Input() class: string;
  @Input() dataSource: any[];

  @Output()columnDislay = new EventEmitter();

  @Input() dataDelete: any = [];
  @Output() isDelete = new EventEmitter();
  isSetting = false;
  selectedItems = [];
  columns = [];
  toolTipDelete = '';
  toolTipExport = '';
  toolTipSettings = '';
  sortNo = 0;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private translateService: AitTranslationService,
  ) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.isDelete.emit({value: false});
    console.log(this.dataDelete);  
  }

  ngOnChanges(changes: SimpleChanges) {
    this.toolTipDelete = this.translateService.translate('delete_selected_item');
    this.toolTipExport = this.translateService.translate('export_csv');
    this.toolTipSettings = this.translateService.translate('setting_table');
   }

  ID(element: string) {
    const idx = this.id && this.id !== '' ? this.id : Date.now();
    return idx + '_' + element;
  }

  exportCsv() {
    if(isObjectFull(this.columnExport)){
      const name = this.fileName + Date.now().toString();
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
        keys: this.columnExport 
      };
      if (this.dataExport.length > 0) {
        new AngularCsv(this.dataExport, name, options);
      } 
    }else{
      const name = this.fileName + Date.now().toString();
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
      };
      if (this.dataExport.length > 0) {
        new AngularCsv(this.dataExport, name, options);
      } 
    }
   
  }

  toggleSetting() {
    this.isSetting = !this.isSetting;
  }

  settingColumnTable(val: any[]) {
    if(this.sortNo == 0 && isObjectFull(val)){
      this.columns = val;     
      this.columnDislay.emit({value: val});  
      this.sortNo++;
    }
    if(this.sortNo > 0){
      this.columns = val;     
      this.columnDislay.emit({value: val}); 
    }
  }

  deletAll(){
    this.isDelete.emit({value: true});
  }

}
