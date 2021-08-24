import {
  isArrayFull,
  isObjectFull,
} from './../../../../../../../../libs/shared/src/lib/utils/checks.util';
import { UserLanguageService } from './../../../../services/user-language.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NbDialogService,
  NbLayoutScrollService,
  NbToastrService,
} from '@nebular/theme';
import { Store } from '@ngrx/store';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitConfirmDialogComponent,
  AitEnvironmentService,
  AitNavigationService,
  AitTranslationService,
  AppState,
  MODE,
  MODULES,
  PAGES,
} from '@ait/ui';
import { Apollo } from 'apollo-angular';
import { KEYS, RESULT_STATUS } from '@ait/shared';

@Component({
  selector: 'ait-user-language',
  templateUrl: './user-language.component.html',
  styleUrls: ['./user-language.component.scss'],
})
export class UserLanguageComponent extends AitBaseComponent implements OnInit {
  // Create form group
  userlanguageInfo: FormGroup;
  userlanguageInfoClone: any;
  defaultValueDate: Date = new Date();

  mode = MODE.NEW;
  errorArr: any;
  isReset = false;
  isClear = false;
  isSubmit = false;
  isChanged = false;
  isResetFile = false;
  isDateCompare = false;
  isInValidTitle = false;
  isInValidCompany = false;
  isInValidLocation = false;

  resetUserInfo = {
    file: false,
    grade: false,
    school: false,
    degree: false,
    start_date_to: false,
    field_of_study: false,
    description: false,
    start_date_from: false,
  };

  dateField = ['start_date_from', 'start_date_to'];
  user_key = '';

  constructor(
    private router: Router,
    private element: ElementRef,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
    private dialogService: NbDialogService,
    private navigation: AitNavigationService,
    private translatePipe: AitTranslationService,
    private userLangService: UserLanguageService,
    private translateService: AitTranslationService,
    env: AitEnvironmentService,
    store: Store<AppState>,
    apollo: Apollo,
    authService: AitAuthService,
    toastrService: NbToastrService,
    layoutScrollService: NbLayoutScrollService
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

    this.setModulePage({
      module: MODULES.JOB,
      page: PAGES.JOB_EDIT,
    });

    this.userlanguageInfo = this.formBuilder.group({
      school: new FormControl(null, [Validators.required]),
      degree: new FormControl(null),
      grade: new FormControl(null),
      field_of_study: new FormControl(null),
      file: new FormControl(null),
      start_date_from: this.defaultValueDate.getTime(),
      start_date_to: new FormControl(null),
      description: new FormControl(null),
    });

    // get key form parameters
    this.user_key = this.activeRouter.snapshot.paramMap.get('id');
    if (this.user_key) {
      this.mode = MODE.EDIT;
    }
  }
  ngOnInit(): void {
  }

  getTitleByMode() {
    return this.mode === MODE.EDIT ? 'Edit language' : 'Add language';
  }

}
