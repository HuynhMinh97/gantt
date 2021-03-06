// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { isObjectFull} from '@ait/shared';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NbMenuService } from '@nebular/theme';
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
  @Input() dataExportAll: any[] = [];
  @Input() fileName = 'My Csv';
  @Input() id = '';
  @Input() collection = 'sys_master_data';
  @Input() class: string;
  @Input() dataSource: any[];
  @Input() defaultValue: any[] = [];
  @Input() selectedItems: any[] = [];

  @Output()watchValue = new EventEmitter();
  @Output() typeDelete = new EventEmitter();
 
  dataCsv: any[] = [];
  isSetting = false;
  columns = [];
  toolTipDelete = '';
  toolTipExport = '';
  toolTipSettings = '';
  position = [];
  positionAll = [];
  sortNo = 0;
  items = [
    { title: 'Profile', data: { id: 'logout' } },
    { title: 'Logout' },
  ];
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    private translateService: AitTranslationService,
    private menuService: NbMenuService,
  ) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    if(!isObjectFull(this.defaultValue)){
      this.defaultValue = this.dataSource;  
    }
    setTimeout(() => {
      this.dataCsv = JSON.parse(JSON.stringify(this.dataExport));
    }, 1000);
    this.menuService.onItemClick().subscribe();
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

  exportCsv(checkType: boolean) {
    let dataInput = [];
    if(checkType){
      dataInput = this.dataExportAll;
    }else{
      dataInput = this.dataExport;
    }
    const header = [];
    const data = [];
    for(const column of this.columnExport) {
      header.push('"'+ column +'"');
    }
    // t??m ki???m v?? s???p x???p
    for(const i of dataInput){
      const item = {};
      for(const column of this.columnExport) {
        for(const j in i){
          if(column == j){
            item[j] = i[j];
          }           
        }
      }
      data.push(item);
    }

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
        headers: header,
        useHeader: false,
        nullToEmptyString: true,
      };
      if (dataInput.length > 0) {
        new AngularCsv(data, name, options);
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
      if (dataInput.length > 0) {
        new AngularCsv(dataInput, name, options);
      } 
    }
   
  }

  toggleSetting() {
    this.isSetting = !this.isSetting;
  }

  async settingColumnTable(val: any[]) {   
    if(this.sortNo == 0 && isObjectFull(val)){
      this.columns = val;     
      this.arrange(this.columns);
      this.sortNo++;
    }else if(this.sortNo > 0){
      this.columns = val;     
      this.arrange(this.columns);
    }
  }

  async settingArrangeTable(val: any[]){
    this.positionAll = val;
    this.arrange(this.columns);
  }

  arrange(val: any[]){
    this.position = [];
    if(this.positionAll.length > 0){
      for(const item of this.positionAll){
        for(const i of val ){
          if(item.code == i._key){
            this.position.push(i);
          }
        }
      }
      this.watchValue.emit({value: this.position});  
    } else {
      this.watchValue.emit({value: val}); 
    }
  }

  deletAll(checkType: boolean){
    this.typeDelete.emit({value: checkType});
  }
}
