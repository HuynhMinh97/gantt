import { PAGE_TYPE } from '@ait/shared';
import {
  AitAuthService,
  AitBaseComponent,
  AitConfirmDialogComponent,
  AitEnvironmentService,
  AitTranslationService,
  AitUserService,
  AppState,
  TabView,
} from '@ait/ui';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NbComponentStatus, NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'ait-example-ui',
  templateUrl: './ait-example-ui.component.html',
  styleUrls: ['./ait-example-ui.component.scss'],
})
export class AitUiComponent extends AitBaseComponent {
  constructor(
    private translateService: AitTranslationService,
    store: Store<AppState>,
    auhtService: AitAuthService,
    userService: AitUserService,
    envService: AitEnvironmentService,
    router: Router,
    private dialogService: NbDialogService,
    apollo: Apollo
  ) {
    super(
      store,
      auhtService,
      apollo,
      userService,
      envService,
      null,
      null,
      null,
      router
    );
    this.setModulePage({
      page: 'example',
      module: 'example',
      type: PAGE_TYPE.VIEW,
    });
    this.testTranslate = translateService.translate(this.testTranslate);
  }

  date = Date.now();
  errors = [];
  state: any = {};

  buttonGroups = {
    one: [
      {
        title: 'c_2001',
        style: 'active',
        action: () => {
          this.action();
        },
      },
      {
        title: 'c_2003',
        style: 'disabled',
        action: () => {
          this.action();
        },
      },
      {
        title: 'c_2002',
        style: 'normal',
        action: () => {
          this.action();
        },
      },
    ],
  };

  testTranslate = 'common.files.numberoffiles';

  buttonStatus = [];

  tabSelect = 'C';
  tabSelected = 'C';

  staticFormatDatePicker = 'yyyy-MM-dd';

  result: any = {};

  status: NbComponentStatus[] = [
    'basic',
    'control',
    'danger',
    'info',
    'primary',
    'success',
    'warning',
  ];

  skills = [
    {
      value: 'Angular',
    },
    {
      value: '.Net',
    },
    {
      value: 'React',
    },
    {
      value: 'Vue',
    },
    {
      value: 'Firebase',
    },
    {
      value: 'Docker',
    },
    {
      value: 'NestJS',
    },
    {
      value: 'CICD',
    },
  ];

  tabs: TabView[] = [
    {
      title: 'Components',
      tabIcon: 'bulb-outline',
      type: 'C',
    },
    {
      title: 'Service',
      tabIcon: 'code-outline',
      type: 'S',
    },
  ];

  errorMessages = ['??? This is a required field.'];

  numberFormats = [
    {
      id: 'number1',
      value: '###,###,###',
    },
    {
      id: 'number3',
      value: '###,###,###.000',
    },
  ];

  confirmDialog = (title: string) => {
    this.dialogService
      .open(AitConfirmDialogComponent, {
        closeOnBackdropClick: true,
        hasBackdrop: true,
        autoFocus: false,
      })
      .onClose.subscribe();
  };

  action() {
    throw new Error('Method not implemented.');
  }

  getValueTextInput = (value) => {
    this.result.text_input = value;
  };

  getValueNumberInput = (value) => {
    this.result.number_input = value;
  };

  getValueDatePicker = (value) => {
    this.result.date_picker = value;
  };

  resetAll = () => {
    this.result.resetAll = true;
    setTimeout(() => {
      this.result.resetAll = false;
    }, 50);
  };

  getValueMasterData = (value) => {
    this.result.master_data = value;
  };

  subMitTextInput = () => {
    this.result.submit_text_input = true;
  };

  subMitTextNumber = () => {
    this.result.submit_text_number = true;
  };

  subMitDatepicker = () => {
    this.result.submit_datepicker = true;
  };

  subMitMaster = () => {
    this.result.submit_master = true;
  };

  subMitMasterData1 = () => {
    this.result.master1 = true;
  };
  subMitMasterData2 = () => {
    this.result.master2 = true;
  };

  subMitFile = () => {
    this.result.file = true;
    setTimeout(() => {
      this.result.file = false;
    }, 100);
  };

  ngOnInit() {
    const condition = {
      user_id: '462dde78-bdfa-4e25-82d5-763e9bfd5016',
    };

    const sData = [
      {
        company: 'd3415d06-601b-42c4-9ede-f5d9ff2bcac3',
        change_at: 1609459200000,
        change_by: 'admin',
        create_at: 1609459200000,
        create_by: 'admin',
        date_format_display: 'TEST_DATE_FORMAT_DISPLAY_01',
        date_format_input: 'TEST_DATE_FORMAT_INPUT_01',
        number_format: 'TEST_NUMBER_FORMAT_01',
        site_language: 'ja_JP',
        timezone: '9',
        user_id: 'b9a08907-2da5-391c-c0c8-4f92937a05c9',
      },
    ];
  }

  getErrors = (value) => (this.errors = [...this.errors, value]);
  removeSearch = (value) => {
    this.errors = this.errors.filter((f) => f !== value);
  };

  getValueInput(status: string, value: string) {
    this.result[status] = value;
  }

  getDate = (date) => {
    this.result.date = date;
  };

  getTabSelected = (tab) => {
    this.tabSelect = tab?.value;
  };

  getTabSelectedExample = (tab) => {
    this.tabSelected = tab?.value;
  };

  getCodeFortranslate = (code) => {
    this.result.code = this.translateService.translate(code);
  };

  getTextArea = (value) => {
    this.result.textarea = value;
  };

  getValueNumber = (label, value) => {
    this.result[label] = value;
  };

  getValueMasterDataOne = (value) => {
    this.result.dataMasterOne = value;
  };
  getValueMaster = (value) => {
    this.result.master = value;
  };
  getValueMasterOne = (value) => {
    this.result.masterOne = value;
  };
}
