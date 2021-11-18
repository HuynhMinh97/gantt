import { UserOnboardingService } from './../../../../services/user-onboarding.service';
import { Component, ElementRef, OnInit, Optional } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NbDialogRef,
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
import { isArrayFull, isObjectFull, KEYS, KeyValueDto, RESULT_STATUS } from '@ait/shared';
import { KeyValueCheckedDto } from './interface';
import { UserProfileService } from 'apps/ait-matching-webapp/src/app/services/user-profile.service';
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

  genderList: KeyValueCheckedDto[];
  defaultGender = {} as KeyValueDto;

  mode = MODE.NEW;
  skills: any;
  errorArr: any;
  cityCode: any;
  countryCode: any;
  districtCode: any;
  sort_no: number;
  isReset = false;
  isLangJP = false;
  isSubmit = false;
  isClear = false;
  isChanged = false;

  resetUserInfo = {
    first_name: false,
    last_name: false,
    katakana: false,
    romaji: false,
    bod: false,
    phone_number: false,
    about: false,
    country_region: false,
    postcode: false,
    province_city: false,
    district: false,
    ward: false,
    address: false,
    floor_building: false,
    company_working: false,
    title: false,
    industry: false,
    skills: false,
  };

  userOnbInfo = {
    first_name: false,
    last_name: false,
    katakana: false,
    romaji: false,
    gender: false,
    bod: false,
    phone_number: false,
    about: false,
    country_region: false,
    postcode: false,
    province_city: false,
    district: false,
    ward: false,
    address: false,
    floor_building: false,
    company_working: false,
    title: false,
    industry: false,
    skills: false,
  };
  isResetCountry = {
    country_region: false,
    postcode: false,
    province_city: false,
    district: false,
    ward: false,
  };

  user_skill = {
    _from: '',
    _to: '',
    relationship: '',
    sort_no: 0,
  };

  user_key = '';
  _key = '';
  user_id_profile = '';
  dataCountry: any;
  constructor(
    private router: Router,
    private element: ElementRef,
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
    private dialogService: NbDialogService,
    private navigation: AitNavigationService,
    private userOnbService: UserOnboardingService,
    private userProfileService: UserProfileService,
    private translateService: AitTranslationService,
    private masterDataService: AitMasterDataService,
    @Optional() private nbDialogRef: NbDialogRef<UserOnboardingComponent>,
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
        Validators.maxLength(200)
      ]),
      romaji: new FormControl(null, [
        Validators.maxLength(200)
      ]),
      gender: new FormControl(null, [Validators.required]),
      bod: new FormControl(null, [Validators.required]),
      phone_number: new FormControl(null, [Validators.required]),
      about: new FormControl(null),
      country_region: new FormControl(null, [Validators.required]),
      postcode: new FormControl(null, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      province_city: new FormControl(null, [Validators.required]),
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
      skills: new FormControl(null, [Validators.required]),
      _key: new FormControl(null),
    });

    // get key form parameter
    // this.user_key = this.activeRouter.snapshot.paramMap.get('id');
    this.userOnbService
      .findSiteLanguageById(this.authService.getUserID())
      .then((r) => {
        if (r.status === RESULT_STATUS.OK) {
          const language = 'ja_JP';
          if (language === r.data[0].site_language) {
            this.isLangJP = true;
          }
        }
      });
  }

  async ngOnInit(): Promise<void> {
    if (this.user_key) {
      this.mode = MODE.EDIT;
    }
    if (this.user_key) {
      this.callLoadingApp();
      await this.userOnbService
        .findUserOnboardingByKey(this.user_key)
        .then(async (r) => {
          if (r.status === RESULT_STATUS.OK) {
            let isUserExist = false;
            this.dataCountry = r.data[0];
            if (r.data.length > 0 && !this.dataCountry.del_flag) {
              this.userOnboardingInfo.patchValue({ ...this.dataCountry });
              this.userOnboardingInfoClone = this.userOnboardingInfo.value;
              this.user_id_profile = this.dataCountry.user_id;
              this._key = this.dataCountry._key;
              isUserExist = true;
            }
            this.cancelLoadingApp();
            !isUserExist && this.router.navigate([`/404`]);
          }
        });
    }else{
      await this.userProfileService.finProfileByUserId(this.user_id)
      .then((res) => {
        if(res.status === RESULT_STATUS.OK && res.data.length > 0){
          this.router.navigate([`recommenced-user`]);
        }
      })
    }

    await this.getGenderList();
    this.setDefaultGenderValue();

    // Run when form value change
    await this.userOnboardingInfo.valueChanges.subscribe((data) => {
      if (this.userOnboardingInfo.pristine) {
        this.userOnboardingInfoClone = AitAppUtils.deepCloneObject(data);
      } else if (this.mode == MODE.EDIT) {
        this.checkAllowSave();
      }
    });

    if (
      this.mode == MODE.EDIT &&
      this.user_id_profile != this.authService.getUserID()
    ) {
      this.mode = MODE.VIEW;
      for (const index in this.userOnbInfo) {
        this.userOnbInfo[index] = true;
      }
    }
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
      ? this.translateService.translate('Edit Onboarding')
      : this.translateService.translate('Add Onboarding');
  }

  // Get gender list from master-data, param class = GENDER
  async getGenderList(): Promise<void> {
    const condition = { class: { value: ['GENDER'] } };
    await this.masterDataService.find(condition).then((res) => {
      if (res.status && res.status === RESULT_STATUS.OK) {
        this.genderList = res.data;
      }
      console.log(this.genderList);
      
    });
  }

  // In create mode default = 男性, edit mode = user.gender
  setDefaultGenderValue() {
    const genderObj = this.userOnboardingInfo.controls['gender']
      .value as KeyValueDto;
    if (genderObj) {
      this.genderList = this.genderList.map((gender) =>
        Object.assign({}, gender, {
          checked: gender.code === genderObj._key ? true : false,
        })
      );
      const gender = this.genderList.find((gender) => gender.checked === true);
      this.userOnboardingInfo.controls['gender'].setValue({
        _key: gender.code,
        value: gender.name,
      });
      const defaultGender = this.genderList[2];
      this.defaultGender = {
        _key: defaultGender.code,
        value: defaultGender.name,
      };
    } else {
      const genderList = [...this.genderList].map((gender, index) =>
        Object.assign({}, gender, { checked: index === 2 ? true : false })
      );

      const gender = genderList[2];

      this.defaultGender = { _key: gender.code, value: gender.name };
      this.userOnboardingInfo.controls['gender'].setValue({
        ...this.defaultGender,
      });
    }
  }

  resetForm() {
    if (this.mode === MODE.NEW) {
      for (const index in this.resetUserInfo) {
        this.resetUserInfo[index] = true;
        setTimeout(() => {
          this.resetUserInfo[index] = false;
        }, 100);
      }
      this.userOnboardingInfo.reset();
      setTimeout(() => {
        this.userOnboardingInfo.controls['gender'].setValue({
          ...this.defaultGender,
        });
      }, 100);
      for (const index in this.isResetCountry) {
        this.isResetCountry[index] = true;
        setTimeout(() => {
          this.isResetCountry[index] = false;
        }, 50);
      }
    } else {
      for (const index in this.resetUserInfo) {
        if (!this.userOnboardingInfo.controls[index].value) {
          this.resetUserInfo[index] = true;
          setTimeout(() => {
            this.resetUserInfo[index] = false;
          }, 100);
        }
      }
      this.isClear = true;
      setTimeout(() => {
        this.isClear = false;
      }, 50);
      this.userOnboardingInfo.patchValue({
        ...this.userOnboardingInfoClone,
      });
      this.dataCountry = { ...this.userOnboardingInfo.value }
    }
    this.showToastr('', this.getMsg('I0007'));
  }

  saveDataUserProfile() {
    const saveData = this.userOnboardingInfo.value;
    saveData.ward = saveData.ward ? saveData.ward?._key : null;
    saveData.title = saveData.title ? saveData.title?._key : null;
    saveData.province_city = saveData.province_city ? saveData.province_city?._key : null;
    saveData.gender = saveData.gender._key;
    saveData.country_region = saveData.country_region ? saveData.country_region?._key : null;
    saveData.district = saveData.district ? saveData.district?._key : null;
    saveData.industry = saveData.industry ? saveData.industry?._key : null;
    saveData.company_working = saveData.company_working ? saveData.company_working?._key : null;
    this.skills = saveData.skills;
    saveData['top_skills'] = [];
    delete saveData.skills;
    if (this.mode === MODE.NEW) {
      saveData['user_id'] = this.user_id;
    } else {
      saveData['user_id'] = this.authService.getUserID();
    }
    return saveData;
  }

  async saveDataUserSkill() {
    this.user_skill._from = 'sys_user/' + this.authService.getUserID();
    this.user_skill.relationship = 'user_skill';
    this.user_skill.sort_no = this.sort_no + 1;
    let number_sort_no = 1;
    const skills = [];
    for (const item of this.skills) {
      await this.userOnbService.findSkillsByCode(item._key).then((res) => {
        skills.push(res.data[0]._key);
      });
    }
    const _fromUserSkill = [
      { _from: 'sys_user/' + this.authService.getUserID() },
    ];
    await this.userOnbService.removeSkills(_fromUserSkill);
    skills.forEach(async (skill) => {
      this.user_skill.sort_no += number_sort_no;
      this.user_skill._to = 'm_skill/' + skill;
      await this.userOnbService.saveUserSkills([this.user_skill]);
      number_sort_no++;
    });
  }

  save() {
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);
    this.userOnboardingInfo.get('skills').setErrors(null);
    if (this.userOnboardingInfo.valid) {
      this.callLoadingApp();
      this.userOnbService
        .save(this.saveDataUserProfile())
        .then((res) => {
          if (res?.status === RESULT_STATUS.OK) {
            this.saveDataUserSkill();
            const message =
              this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
            this.showToastr('', message);
            this.cancelLoadingApp();
            if(this.user_key){
              this.close(true);
            }else{
              this.router.navigate([`user-job-alert`]);
            }
          } else {
            this.cancelLoadingApp();
            this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
          }
        })
        .catch(() => {
          this.cancelLoadingApp();
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        });
    } else {
      this.scrollIntoError();
    }
  }

  onDelete() {
    this.dialogService
      .open(AitConfirmDialogComponent, {
        closeOnBackdropClick: true,
        hasBackdrop: true,
        autoFocus: false,
        context: {
          title: this.getMsg('I0004'),
        },
      })
      .onClose.subscribe(async (event) => {
        if (event) {
          const _key = [{ _key: this._key }];
          if (this.user_id) {
            await this.userOnbService.remove(_key).then((res) => {
              if (res.status === RESULT_STATUS.OK && res.data.length > 0) {
                this.showToastr('', this.getMsg('I0003'));
                if(this.user_key){
                  this.close(false);
                }else{
                  history.back();
                }
              } else {
                this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
              }
            });
          } else {
            this.showToastr('', this.getMsg('E0050'), KEYS.WARNING);
          }
        }
      });
  }

  back() {
    if (this.isChanged) {
      this.dialogService
        .open(AitConfirmDialogComponent, {
          closeOnBackdropClick: true,
          hasBackdrop: true,
          autoFocus: false,
          context: {
            title: this.getMsg('I0006'),
          },
        })
        .onClose.subscribe(async (event) => {
          if (event) {
            if(this.user_key){
              this.close(false);
            }else{
              history.back();
            }
          }
        });
    } else {
      if(this.user_key){
        this.close(false);
      }else{
        history.back();
      }
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
        } catch { }
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
        data.push(file);
      });
      this.userOnboardingInfo.markAsDirty();
      this[group].controls[form].setValue(data);
    } else {
      this[group].controls[form].setValue(null);
    }
  }
  takeValueCountry(item: any) {
    if (item) {
      this.userOnboardingInfo.markAsDirty();
      this.userOnboardingInfo.patchValue(item);
    } else {
      this.userOnboardingInfo.patchValue(null);

    }

  }

  close(event: boolean) {
    this.nbDialogRef.close(event);
  }
}
