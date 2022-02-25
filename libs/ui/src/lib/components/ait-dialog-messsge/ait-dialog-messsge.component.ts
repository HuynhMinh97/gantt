import { 
  AitAuthService, 
  AitBaseComponent, 
  AitConfirmDialogComponent, 
  AitEnvironmentService, 
  AitTableCellComponent, 
  AitTranslationService, 
  AppState 
} from '@ait/ui';
import { Component, Input, OnInit} from '@angular/core';
import { NbDialogRef, NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'ait-ait-message-error',
  templateUrl: './ait-dialog-messsge.component.html',
  styleUrls: ['./ait-dialog-messsge.component.scss']
})
export class AitDialogMesssgeComponent extends AitBaseComponent implements OnInit {

  @Input() listDataError: any = [];
  @Input() style = {};
  done = false;
  totalRows = 10;
  pageDetail = '';
  perPage = '10';
  source: LocalDataSource;
  isValidPage = true;
  countPage = 0;
  left = 0;
  settings = {
    actions: false,
    selectMode: 'multi',
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {}
  };
  setting = {
    actions: false,
    selectMode: 'multi',
    pager: {
      display: true,
      perPage: 10,
    },
    columns: {
      row: {
        title: 'Row',
        filter: true
      },
      name: {
        title: 'Name',
        filter: true
      },
      pager: {
        title: 'Pager',
        filter: true
      },
      error: {
        title: 'Error',
        filter: true,
        type: 'custom',
        renderComponent: AitTableCellComponent,
        valuePrepareFunction: (value: string) => {

          const obj = {
            text: value,
            type: 'array',
            style: {
              width: 300
            }
          }
          return obj;
        },
      },
    }
  };

  constructor(
    private nbDialogRef: NbDialogRef<AitConfirmDialogComponent>,
    private translateService: AitTranslationService,
    env: AitEnvironmentService,
    store: Store<AppState>,
    apollo: Apollo,
    authService: AitAuthService,
    toastrService: NbToastrService,
    layoutScrollService: NbLayoutScrollService,
  ) { 
    super(
      store,
      authService,
      apollo,
      null,
      env,
      layoutScrollService,
      toastrService
    );
    setTimeout(() => { 
      this.setting.columns.row.title = this.translateService.translate('case');
      this.setting.columns.name.title = this.translateService.translate('name');
      this.setting.columns.pager.title = this.translateService.translate('page');
      this.setting.columns.error.title = this.translateService.translate('error name');   
      this.settings = this.setting
      this.done = true;
    },300)
  }
  // eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
  ngOnInit(): void {
    setTimeout(() => {
      this.source = new LocalDataSource(this.listDataError);      
    },0);
  }

 

  // eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
  ngDoCheck() {
    this.totalRows = this.source != null ? this.source.count() : 0;
    if (this.totalRows <= +this.perPage) {
      this.isValidPage = false;
    } else {
      this.isValidPage = true;
    }
    if (this.totalRows > 0) {
      try {
        const pageDetailStr = this.translateService.translate('out of');
        const currentPaging = this.source.getPaging();
        const num1 = (currentPaging.page - 1) * currentPaging.perPage + 1;
        const num2 = num1 + (currentPaging.perPage - 1);
        const num3 = num2 > this.totalRows ? this.totalRows : num2;
        this.pageDetail =  (pageDetailStr || '')
        .replace('{0}', `${num1} - ${num3}`)
        .replace('{1}', `${this.totalRows}`);
        this.left = this.getLeft(+currentPaging.page);
        this.countPage = (num3 - num1) + 1;
      } catch {
      }
    }
  }

  getLeft(page: number): number {
    if (page < 8) {
      return 523;
    } else if (page === 8) {
      return 531;
    } else if (page === 9) {
      return 539;
    } else if (page === 10) {
      return 547;
    } else {
      return 545;
    }
  }
  closeDialog(event: boolean) {
    this.nbDialogRef.close(event);
  }

}
