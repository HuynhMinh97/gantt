import { forEach } from 'lodash';
import {
  isArrayFull,
  isObjectFull,
} from './../../../../../../../../libs/shared/src/lib/utils/checks.util';
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
  AitMasterDataService,
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
  defaultGender = {} as KeyValueDto;

  mode = MODE.NEW;
  errorArr: any;
  countryCode: any;
  cityCode: any;
  districtCode: any;
  isReset = false;
  isSubmit = false;
  isChanged = false;
  isLangJP = false;

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

  user_skill = {
    _from: '',
    _to: '',
    relationship: '',
    sort_no: 0,
  };

  user_key = '';

  constructor(
    private router: Router,
    private element: ElementRef,
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
    private dialogService: NbDialogService,
    private userOnbService: UserOnboardingService,
    private masterDataService: AitMasterDataService,
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

    this.userOnbService.findSiteLanguageById(this.user_id).then((r) => {
      if (r.status === RESULT_STATUS.OK) {
        const language = 'ja_JP';
        if (language === r.data[0].site_language) {
          this.isLangJP = true;
        }
      }
    });

    // get key form parameters
    this.user_key = this.activeRouter.snapshot.paramMap.get('id');
    if (this.user_key) {
      this.mode = MODE.EDIT;
    }
  }

  async ngOnInit(): Promise<void> {
    if (this.user_key) {
      await this.userOnbService
        .findUserOnboardingByKey(this.user_key)
        .then(async (r) => {
          if (r.status === RESULT_STATUS.OK) {
            let isUserExist = false;
            let skills = [];
            if (r.data.length > 0) {
              const data = r.data[0];
              this.userOnboardingInfo.patchValue({ ...data });
              console.log(this.userOnboardingInfo.value);
              
              this.userOnboardingInfoClone = this.userOnboardingInfo.value;
              isUserExist = true;
            }
            !isUserExist && this.router.navigate([`/404`]);
          }
        });
    }

    await this.getGenderList();
    this.setDefaultGenderValue();

    // Run when form value change
    await this.userOnboardingInfo.valueChanges.subscribe((data) => {
      if (this.userOnboardingInfo.pristine) {
        this.userOnboardingInfo = AitAppUtils.deepCloneObject(data);
      } else {
        this.checkAllowSave();
      }
    });
  }

  checkAllowSave() {
    const userInfo = { ...this.userOnboardingInfo.value };
    const userInfoClone = { ...this.userOnboardingInfoClone };

    this.isChanged = !AitAppUtils.isObjectEqual(
      { ...userInfo },
      { ...userInfoClone }
    );
  }

  getTitleByMode() {
    return this.mode === MODE.EDIT
      ? 'Edit basic information'
      : 'Add basic information';
  }

  // Get gender list from master-data, param class = GENDER
  async getGenderList(): Promise<void> {
    const condition = { class: { value: ['GENDER'] } };
    await this.masterDataService.find(condition).then((res) => {
      if (res.status && res.status === RESULT_STATUS.OK) {
        this.genderList = res.data;
      }
    });
  }

  // In create mode default = 男性, edit mode = user.gender
  setDefaultGenderValue() {
    const genderObj = this.userOnboardingInfo.controls['gender']
      .value as KeyValueDto;

    if (genderObj) {
      this.genderList = this.genderList.map((gender) =>
        Object.assign({}, gender, {
          checked: gender._key === genderObj._key ? true : false,
        })
      );

      const gender = this.genderList.find((gender) => gender.checked === true);
      this.userOnboardingInfo.controls['gender'].setValue({
        _key: gender.code,
        value: gender.name,
      });
      const defaultGender = this.genderList[0];
      this.defaultGender = {
        _key: defaultGender.code,
        value: defaultGender.name,
      };
    } else {
      const genderList = [...this.genderList].map((gender, index) =>
        Object.assign({}, gender, { checked: index === 0 ? true : false })
      );
      const gender = genderList[2];
      this.userOnboardingInfo.controls['gender'].setValue({
        _key: gender.code,
        value: gender.name,
      });
      this.defaultGender = { _key: gender.code, value: gender.name };
    }
  }

  resetForm() {
    this.isChanged = false;
    if (this.mode === MODE.NEW) {
      for (const index in this.resetUserInfo) {
        this.resetUserInfo[index] = true;
        setTimeout(() => {
          this.resetUserInfo[index] = false;
        }, 100);
      }
      this.userOnboardingInfo.reset();
      this.userOnboardingInfo.controls['gender'].setValue({
        ...this.defaultGender,
      });
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

  saveDataUserProfile() {
    const saveData = this.userOnboardingInfo.value;
    saveData['user_id'] = this.authService.getUserID();
    saveData.ward = saveData.ward._key;
    saveData.title = saveData.title._key;
    saveData.city = saveData.city._key;
    saveData.gender = saveData.gender._key;
    saveData.country = saveData.country._key;
    saveData.district = saveData.district._key;
    saveData.industry = saveData.industry._key;
    saveData.company_working = saveData.company_working._key;

    if (this.user_key) {
      saveData['_key'] = this.user_key;
    }
    console.log(saveData);

    return saveData;
  }

  saveDataUserSkill() {
    this.user_skill._from = 'sys_user/' + this.authService.getUserID();
    this.user_skill.relationship = 'user_skill';
    this.user_skill.sort_no = 1;

    const skills = this.userOnboardingInfo.value.skills;
    skills.forEach(async (skill) => {
      this.user_skill._to = 'm_skill/' + skill;

      if (this.user_key) {
        this.user_skill['_key'] = this.user_key;
      }
      await this.userOnbService.saveUserSkill([this.user_skill]);
    });
  }

  save() {
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);

    if (this.userOnboardingInfo.valid) {
      this.userOnbService
        .save(this.saveDataUserProfile())
        .then((res) => {
          //console.log(res);
          if (res?.status === RESULT_STATUS.OK) {
            this.saveDataUserSkill();
            const message =
              this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
            this.showToastr('', message);
            history.back();
          } else {
            this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
          }
        })
        .catch(() => {
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        });
    } else {
      this.scrollIntoError();
    }
  }

  scrollIntoError() {
    for (const key of Object.keys(this.userOnboardingInfo.controls)) {
      if (this.userOnboardingInfo.controls[key].invalid) {
        const invalidControl = this.element.nativeElement.querySelector(
          `#${key}_input`
        );
        try {
          invalidControl.scrollIntoView({
            behavior: 'auto',
            block: 'center',
          });
          break;
        } catch {}
      }
    }
  }

  takeGenderValue(value: KeyValueCheckedDto): void {
    if (isObjectFull(value)) {
      this.userOnboardingInfo.controls['gender'].markAsDirty();
      this.userOnboardingInfo.controls['gender'].setValue({
        _key: value.code,
        value: value.name,
      });
    } else {
      this.userOnboardingInfo.controls['gender'].setValue(null);
    }
  }

  takeMasterValue(value: any, target: string): void {
    if (isObjectFull(value)) {
      this.userOnboardingInfo.controls[target].markAsDirty();
      this.userOnboardingInfo.controls[target].setValue(value?.value[0]);
      if (target === 'country') {
        this.countryCode = value?.value[0]._key;
        this.resetUserInfo['district'] = true;
        this.resetUserInfo['ward'] = true;
        setTimeout(() => {
          this.resetUserInfo['district'] = false;
          this.resetUserInfo['ward'] = false;
        }, 100);
      }
      if (target === 'city') {
        this.cityCode = value?.value[0]._key;
        this.resetUserInfo['ward'] = true;
        setTimeout(() => {
          this.resetUserInfo['ward'] = false;
        }, 100);
      }
      if (target === 'district') {
        this.districtCode = value?.value[0]._key;
      }
    } else {
      this.userOnboardingInfo.controls[target].setValue(null);
    }
  }

  takeInputValue(value: string, form: string): void {
    if (value) {
      this.userOnboardingInfo.controls[form].markAsDirty();
      this.userOnboardingInfo.controls[form].setValue(value);
    } else {
      this.userOnboardingInfo.controls[form].setValue(null);
    }
  }

  takeDatePickerValue(value: number, group: string, form: string) {
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
    }
  }
  // Take values form components and assign to form
  takeMasterValues(value: KeyValueDto[], group: string, form: string): void {
    if (isArrayFull(value)) {
      const data = [];
      value.forEach((file) => {
        data.push(file._key);
      });
      this.userOnboardingInfo.markAsDirty();
      this[group].controls[form].setValue(data);
    } else {
      this[group].controls[form].setValue(null);
    }
  }
}
