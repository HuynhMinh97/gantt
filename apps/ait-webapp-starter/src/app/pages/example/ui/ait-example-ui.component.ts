import {
  AitAuthService,
  AitBaseComponent,
  AitConfirmDialogComponent,
  AitEnvironmentService,
  AitTranslationService,
  AitUserService,
  AitUserSettingService,
  AppState,
  TabView,
} from '@ait/ui';
import { Component, ViewChild } from '@angular/core';
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
    private router: Router,
    private testService: AitUserSettingService,
    private dialogService: NbDialogService,
    apollo: Apollo,
  ) {
    super(store, auhtService, apollo, userService, envService);
    this.setModulePage({
      page: 'example',
      module: 'example',
    });
    this.testTranslate = translateService.translate(this.testTranslate);
    console.log(router)
  }

  date = Date.now();

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

  errorMessages = ['❌ This is a required field.'];

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
    this.dialogService.open(AitConfirmDialogComponent, {
      closeOnBackdropClick: true,
      hasBackdrop: true,
      autoFocus: false,
    }).onClose.subscribe(r => {
      console.log(r)
    })
  }

  ///methods

  getValueTextInput= (value) => {
    this.result.text_input = value
  }

  getValueNumberInput= (value) => {
    this.result.number_input = value
  }

  getValueDatePicker= (value) => {
    this.result.date_picker = value
  }


  getValueMasterData= (value) => {
    this.result.master_data = value
  }


  ngOnInit() {
    // console.log(this.page, this.module, this.user_id, this.company);
    const condition = {
      user_id: '462dde78-bdfa-4e25-82d5-763e9bfd5016'
    }

    const sData = [{
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
      user_id: 'b9a08907-2da5-391c-c0c8-4f92937a05c9'
    }];

    const dData = [{
      _key: '7f8c8cac-0f92-483a-039a-905e024bacba'
    }]

    // this.testService.find(condition).then(data => console.log(data));
    // this.testService.save(sData).then(data => console.log(data));
    // this.testService.remove(dData).then(data => console.log(data));
  }

  action = () => {
    console.log('hello from home component');
  };

  getValueInput(status: string, value: string) {
    console.log(status, value);
    this.result[status] = value;
  }

  handleOnchange(value: string, label: string) {
    console.log(value, label);
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
    console.log(value);
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
