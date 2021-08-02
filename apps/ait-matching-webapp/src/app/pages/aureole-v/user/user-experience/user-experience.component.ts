import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitConfirmDialogComponent,
  AitEnvironmentService,
  AitTranslationService,
  AppState,
  MODE,
} from '@ait/ui';
import {
  NbButtonModule,
  NbIconModule,
  NbSpinnerModule,
  NbTooltipModule,
} from '@nebular/theme';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'ait-user-experience',
  templateUrl: './user-experience.component.html',
  styleUrls: ['./user-experience.component.scss'],
})
export class UserExperienceComponent
extends AitBaseComponent
implements OnInit {
  // Create form group
  userExperienceInfo: FormGroup;
  userExperienceInfoClone: any;
  
  mode = MODE.NEW;
  isChanged = false;
  isDataInit = false;
  isReset = false;
  isError = false;
  isInValidInput = false;

  user_key = '';

  resetUserInfo = {
    title: false,
    company_working: false,
    location: false,
    employment_type: false,
    is_working: false,
    start_date_from: false,
    start_date_to: false,
    description: false,
  };

  isOpen = {
    userExperienceInfo: true
  };

  fakeData = {
    id: '1',
    user_id: '01442c21-0944-46e2-a946-0df9dc0d08c7',
    title: [
      { _key: '11a', value: 'HEHEHE123' },
      { _key: '11b', value: '676767assad' },
    ],
    company_working: [
      { _key: '1a', value: 'Bin' },
      { _key: '1b', value: 'Thuan' },
    ],
    location: [
      { _key: '2a', value: 'Alo HiHi' },
      { _key: '2b', value: 'Hahaha' },
      { _key: '2c', value: 'HUHUHU' },
    ],
    employment_type: [
      { _key: '3a', value: 'HEHEHE' },
      { _key: '3b', value: 'HOHOHOHO' },
    ],
    is_working: true,
    start_date_from: 1641945600000,
    start_date_to: 1627446494365,
    description: 'Bin Bin Bin Bin Bin Bin',
  };

  dateField = [
    'start_date_from',
    'start_date_to'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
    layoutScrollService: NbLayoutScrollService,
    public activeRouter: ActivatedRoute,
    store: Store<AppState>,
    authService: AitAuthService,
    env: AitEnvironmentService,
    apollo: Apollo,
    toastrService: NbToastrService
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

    //Create form builder group
    this.userExperienceInfo = this.formBuilder.group({
      title: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
      ]),
      company_working: new FormControl(null),
      location: new FormControl(null),
      employment_type: new FormControl(null),
      is_working: new FormControl(null),
      start_date_from: new FormControl(null),
      start_date_to: new FormControl(null),
      description: new FormControl(null, [Validators.maxLength(4000)]),
    });

    // get key form parameters
    this.user_key = this.activeRouter.snapshot.paramMap.get('id');
    if (this.user_key) {
      this.mode = MODE.EDIT;
    }
    if (this.mode === MODE.NEW) {
      this.userExperienceInfo.addControl(
        'agreement',
        new FormControl(false, [Validators.requiredTrue])
      );
    }
  }

  ngOnInit(): void {
    this.callLoadingApp();
    // Run when form value change and only in edit mode
    this.userExperienceInfo.valueChanges.subscribe((data) => {
      if (this.userExperienceInfo.pristine) {
        this.userExperienceInfoClone = AitAppUtils.deepCloneObject(data);
      } else if (this.mode === MODE.EDIT) {
        this.checkAllowSave();
      }
    });

    if (this.user_key) {
      this.userExperienceInfo.patchValue({ ...this.fakeData });
    }
  }

  resetForm = () => {
    if (this.mode === MODE.NEW) {
      this.userExperienceInfo.reset();
      for (const index in this.resetUserInfo) {
        this.resetUserInfo[index] = true;
        setTimeout(() => {
          this.resetUserInfo[index] = false;
        }, 100);
      }
    } else {
      this.userExperienceInfo.patchValue({ ...this.fakeData });
      for (const index in this.resetUserInfo) {
        if (!this.userExperienceInfo.controls[index].value) {
          this.resetUserInfo[index] = true;
          setTimeout(() => {
            this.resetUserInfo[index] = false;
          }, 100);
        }
      }
    }
    this.showToastr('', this.getMsg('Reset Success !!!'));
  };

  confirmBeforeDelete = () => {
    this.dialogService
      .open(AitConfirmDialogComponent, {
        closeOnBackdropClick: true,
        hasBackdrop: true,
        autoFocus: false,
        context: {
          title: this.getMsg('Delete ?'),
        }
      })
      .onClose.subscribe(async (event) => {
        if (event) {
          this.delete();
        }
      });
  }

  async delete() {
    const data = document.getElementById("1");
    if(data == null){
      this.showToastr('', this.getMsg('情報削除が成功しました。'));
      this.callLoadingApp();
      this.goBack()
    }
  //   await this.userProfileService.removeAllByUserId(this.user_key).then(res => {
  //     console.log(res);
  //     if (res.status === RESULT_STATUS.OK && res.data.length > 0) {
  //       this.showToastr('', this.getMsg('情報削除が成功しました。'));
  //       this.router.navigate([`/recommenced-user`]);
  //     } else {
  //       this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
  //     }
  // });
}

  saveAndClose() {
    console.log(this.userExperienceInfo.value);
  }

  toggleCheckBox(checked: boolean) {
    this.userExperienceInfo.controls['is_working'].setValue(checked);
  }

  toggleContent(group: string, status: boolean) {
    this.isOpen[group] = status;
  }

  takeInputValue(value: string, form: string): void {
    if (value) {
      this.userExperienceInfo.controls[form].markAsDirty();
      this.userExperienceInfo.controls[form].setValue(value);
    } else {
      this.userExperienceInfo.controls[form].setValue(null);
    }
  }

  checkValidate(target?: string) {
    if (this.userExperienceInfo.controls[target].invalid) {
      return this.isInValidInput = true;
    }
  }

  checkAllowSave() {
    const userInfo = { ...this.userExperienceInfo.value };
    const userInfoClone = { ...this.userExperienceInfoClone };

    this.setHours(userInfo);

    const isChangedUserInfo = AitAppUtils.isObjectEqual(
      { ...userInfo },
      { ...userInfoClone }
    );
    this.isChanged = !(
      isChangedUserInfo
    );
  }

  setHours(data: any) {
    for (const prop in data) {
      if (this.dateField.includes(prop)) {
        if (data[prop]) {
          data[prop] = new Date(data[prop]).setHours(0, 0, 0, 0);
        }
        if (data[prop]) {
          data[prop] = new Date(data[prop]).setHours(0, 0, 0, 0);
        }
      }
    }
  }

  getFormValue(form) {
    return this.userExperienceInfo.controls[form].value
      ? this.userExperienceInfo.controls[form].value
      : '';
  }
}
