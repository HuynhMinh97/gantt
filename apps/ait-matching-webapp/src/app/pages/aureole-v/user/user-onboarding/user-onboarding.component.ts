import { isObjectFull } from './../../../../../../../../libs/shared/src/lib/utils/checks.util';
import { UserOnboardingService } from './../../../../services/user-onboarding.service';
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
} from '@ait/ui';
import { Apollo } from 'apollo-angular';
import { KEYS, KeyValueDto, RESULT_STATUS } from '@ait/shared';
import { KeyValueCheckedDto } from './interface';

@Component({
  selector: 'ait-user-onboarding',
  templateUrl: './user-onboarding.component.html',
  styleUrls: ['./user-onboarding.component.scss'],
})
export class UserOnboardingComponent
  extends AitBaseComponent
  implements OnInit {
  // Create form group
  userOnboardingInfo: FormGroup;
  userOnboardingInfoClone: any;

  defaultCompany = {} as KeyValueDto;
  genderList: KeyValueCheckedDto[];

  mode = MODE.NEW;
  errorArr: any;
  isReset = false;
  isSubmit = false;
  isChanged = false;
  isDateCompare = false;

  resetUserInfo = {
    first_name: false,
    last_name: false,
    katakana: false,
    romaji: false,
    gender: false,
    bod: false,
    phone_number: false,
    about: false,
    country: false,
    postcode: false,
    city: false,
    district: false,
    ward: false,
    address: false,
    floor_building: false,
    company_working: false,
    title: false,
    industry: false,
    skills: false,
  };

  user_key = '';

  constructor(
    private router: Router,
    private element: ElementRef,
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
    private dialogService: NbDialogService,
    private userOnbService: UserOnboardingService,
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
      module: 'user',
      page: 'user_onboarding',
    });

    this.userOnboardingInfo = this.formBuilder.group({
      first_name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
      ]),
      last_name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
      ]),
      katakana: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
      ]),
      romaji: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
      ]),
      gender: new FormControl(null, [Validators.required]),
      bod: new FormControl(null, [Validators.required]),
      phone_number: new FormControl(null, [Validators.required]),
      about: new FormControl(null),
      country: new FormControl(null),
      postcode: new FormControl(null, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      city: new FormControl(null, [Validators.required]),
      district: new FormControl(null, [Validators.required]),
      ward: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [
        Validators.required,
        Validators.maxLength(500),
      ]),
      floor_building: new FormControl(null, [Validators.maxLength(500)]),
      company_working: new FormControl(null),
      title: new FormControl(null),
      industry: new FormControl(null, [Validators.required]),
      skills: new FormControl(null, [
        Validators.required,
        Validators.maxLength(10),
      ]),
    });

    // get key form parameters
    this.user_key = this.activeRouter.snapshot.paramMap.get('id');
    if (this.user_key) {
      this.mode = MODE.EDIT;
    }
  }

  async ngOnInit(): Promise<void> {}

  options = [
    { value: 'This is value 1', label: 'MALE' },
    { value: 'This is value 2', label: 'FEMALE' },
    { value: 'This is value 3', label: 'Other', checked: true},
  ];
  option;

  getTitleByMode() {
    return this.mode === MODE.EDIT ? 'Edit basic information' : 'Add basic information';
  }

  resetForm() {
    this.errorArr = [];
    this.isChanged = false;
    if (this.mode === MODE.NEW) {
      for (const index in this.resetUserInfo) {
        this.resetUserInfo[index] = true;
        setTimeout(() => {
          this.resetUserInfo[index] = false;
        }, 100);
      }
      this.userOnboardingInfo.reset();
    } else {
      for (const index in this.resetUserInfo) {
        if (!this.userOnboardingInfo.controls[index].value) {
          this.resetUserInfo[index] = true;
          setTimeout(() => {
            this.resetUserInfo[index] = false;
          }, 100);
        }
      }
      this.userOnboardingInfo.patchValue({
        ...this.userOnboardingInfoClone,
      });
    }
    this.showToastr('', this.getMsg('I0007'));
  }
}
