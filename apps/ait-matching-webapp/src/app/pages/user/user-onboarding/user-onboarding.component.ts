import { UserOnboardingService } from './../../../services/user-onboarding.service';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Optional,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import {
  NbDialogRef,
  NbDialogService,
  NbLayoutScrollService,
  NbToastrService,
} from '@nebular/theme';
import { select, Store } from '@ngrx/store';
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
  getUserSetting,
  MODE,
} from '@ait/ui';
import { Apollo } from 'apollo-angular';
import {
  isArrayFull,
  isObjectFull,
  KEYS,
  KeyValueDto,
  RESULT_STATUS,
} from '@ait/shared';
import { KeyValueCheckedDto } from './interface';
import { UserProfileService } from '../../../services/user-profile.service';
import { UserSkillsService } from '../../../services/user-skills.service';
import { UserProjectService } from '../../../services/user-project.service';
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
  userJobSettingInfo: FormGroup;
  userJobSettingInfoClone: any;
  userOnboardingInfoClone: any;
  toggle = new EventEmitter();
  genderList: KeyValueCheckedDto[];
  defaultGender = {} as KeyValueDto;
  basicInfomation = 'Basic Infomation';
  mode = MODE.NEW;
  current_job_skills: any;
  job_setting_skills: any;
  job_setting_industry: any[];
  errorArr: any;
  cityCode: any;
  countryCode: any;
  districtCode: any;
  dateErrorObject = {};
  availableTimeErrorMessage = [];
  companySkills = [];
  jobSettingSkills = [];
  dateFormat = '';
  sort_no = 0;
  maxSkillJobSetting = 10;
  maxSkillCurrentJob = 50;

  isReset = false;
  isLangJP = false;
  isSubmit = false;
  isClear = false;
  isChanged = false;
  isDisplay = false;
  isExpan = false;
  available_time_error = false;
  resetJobSettingInfo = {
    job_setting_title: false,
    industry: false,
    job_setting_skills: false,
    location: false,
    job_setting_level: false,
    available_time_to: false,
    available_time_from: false,
  };
  resetUserInfo = {
    first_name: false,
    last_name: false,
    katakana: false,
    romaji: false,
    dob: false,
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
    current_job_title: false,
    industry_working: false,
    current_job_skills: false,
    current_job_level: false,
  };

  userOnbInfo = {
    first_name: false,
    last_name: false,
    katakana: false,
    romaji: false,
    gender: false,
    dob: false,
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
  jobSettingInfo: any;
  user_skill = {
    _from: '',
    _to: '',
    sort_no: 0,
  };
  JobSettingData: any;
  JobSettingAttributes = [
    'current_job_skills',
    'job_setting_title',
    'job_setting_level',
  ];
  JobSettingDateAttrubutes = [
    'available_time_from',
    'available_time_to',
    'location',
    'job_setting_skills',
  ];

  user_key = '';
  _key = '';
  user_id_profile = '';
  dataCountry: any;
  jobSettingData: any;
  isLoad = false;
  constructor(
    router: Router,
    private element: ElementRef,
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
    private dialogService: NbDialogService,
    private navigation: AitNavigationService,
    private userProjectService: UserProjectService,
    private userOnbService: UserOnboardingService,
    private userSkillsService: UserSkillsService,
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
      toastrService,
      null,
      router
    );

    store.pipe(select(getUserSetting)).subscribe((setting) => {
      if (isObjectFull(setting) && setting['date_format_display']) {
        this.dateFormat = setting['date_format_display'];
      }
    });

    this.setModulePage({
      module: 'user',
      page: 'user_onboarding',
    });
    this.userJobSettingInfo = this.formBuilder.group({
      job_setting_title: new FormControl(null),
      industry: new FormControl(null, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      location: new FormControl(null),
      job_setting_skills: new FormControl(null, Validators.maxLength(50)),
      job_setting_level: new FormControl(null),
      available_time_from: new FormControl(null),
      available_time_to: new FormControl(null),
      _key: new FormControl(null),
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
      katakana: new FormControl(null),
      romaji: new FormControl(null),
      gender: new FormControl(null, [Validators.required]),
      dob: new FormControl(null, [Validators.required]),
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
      current_job_title: new FormControl(null),
      industry_working: new FormControl(null, [Validators.required]),
      current_job_level: new FormControl(null),
      current_job_skills: new FormControl(null, Validators.maxLength(50)),
      _key: new FormControl(null),
    });

    // get key form parameter
    this.user_key = this.activeRouter.snapshot.paramMap.get('id');
    this._key = this.activeRouter.snapshot.paramMap.get('id');
    this.user_id_profile = this.authService.getUserID();
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
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.close(false);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    setTimeout(() => {
      this.isLoad = true;
    }, 500);
    if (this.user_key) {
      this.mode = MODE.EDIT;
    }
    if (this.user_key) {
      if (this.user_key !== this.user_id_profile) {
        this.callLoadingApp();
        this.router.navigate([`user-onboarding-detail/${this.user_key}`]);
      } else {
        this.callLoadingApp();
        await this.userOnbService.findJobSetting(this.user_key).then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            this.jobSettingData = r.data[0];
            this.userJobSettingInfo.patchValue({ ...this.jobSettingData });
            this.userJobSettingInfoClone = this.userJobSettingInfo.value;
          } else {
            this.callLoadingApp();
          }
        });
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
            } else {
              this.callLoadingApp();
            }
          });
        await this.findSkills();
      }
    }
    await this.getGenderList();
    setTimeout(() => {
      this.cancelLoadingApp();
    }, 500);
    this.setDefaultGenderValue();

    await this.userOnboardingInfo.valueChanges.subscribe((data) => {
      this.checkAllowSave();
    });

    await this.userJobSettingInfo.valueChanges.subscribe((data) => {
      this.checkAllowSaveJobSetting();
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

  toggleExpan = () => {
    this.isExpan = !this.isExpan;
    this.toggle.emit(this.isExpan);
  };
  checkAllowSaveJobSetting() {
    const jocSettingInfo = { ...this.userJobSettingInfo.value };
    const jocSettingInfoClone = { ...this.userJobSettingInfoClone };
    this.isChanged = !AitAppUtils.isObjectEqual(
      { ...jocSettingInfo },
      { ...jocSettingInfoClone }
    );
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
      const defaultGender = this.genderList[2];
      this.defaultGender = {
        _key: defaultGender._key,
        value: defaultGender.name,
      };
    } else {
      const genderList = [...this.genderList].map((gender, index) =>
        Object.assign({}, gender, { checked: index === 2 ? true : false })
      );

      const gender = genderList[2];

      this.defaultGender = { _key: gender._key, value: gender.name };
      this.userOnboardingInfo.controls['gender'].setValue({
        ...this.defaultGender,
      });
    }
  }

  // get skill current job
  async findSkills() {
    const from = 'sys_user/' + this.user_id;
    await this.userOnbService.findSkillsByFrom(from).then(async (res) => {
      const listSkills = [];
      for (const skill of res.data) {
        listSkills.push(skill?.skills);
      }

      this.userOnboardingInfo.controls['current_job_skills'].setValue([
        ...listSkills,
      ]);
      this.companySkills = listSkills;
      this.userOnboardingInfoClone = this.userOnboardingInfo.value;
      this.cancelLoadingApp();
    });
  }

  resetForm() {
    if (this.mode === MODE.NEW) {
      for (const index in this.resetUserInfo) {
        this.resetUserInfo[index] = true;
        setTimeout(() => {
          this.resetUserInfo[index] = false;
        }, 100);
      }
      for (const index in this.resetJobSettingInfo) {
        this.resetJobSettingInfo[index] = true;
        setTimeout(() => {
          this.resetJobSettingInfo[index] = false;
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
      for (const index in this.resetJobSettingInfo) {
        if (!this.userJobSettingInfo.controls[index].value) {
          this.resetJobSettingInfo[index] = true;
          setTimeout(() => {
            this.resetJobSettingInfo[index] = false;
          }, 100);
        }
      }
      this.userJobSettingInfo.patchValue({ ...this.userJobSettingInfoClone });
      this.jobSettingData = { ...this.userJobSettingInfo.value };
      this.dataCountry = { ...this.userOnboardingInfo.value };
    }
    this.showToastr('', this.getMsg('I0007'));
  }

  checkDateError() {
    const name = 'available_time_error';
    const valueFrom = this.userJobSettingInfo.controls['available_time_from']
      .value;
    const valueTo = this.userJobSettingInfo.controls['available_time_to'].value;

    if (!valueFrom || !valueTo) {
      this[name] = false;
    } else if (valueFrom > valueTo) {
      this[name] = true;
    } else {
      this[name] = false;
    }
    this.getError();
  }

  getError() {
    const msg = this.getMsg('E0004');
    const availableTimeErr = (msg || '')
      .replace('{0}', this.translateService.translate('available_time_to'))
      .replace(
        '{1}',
        this.translateService.translate('available_time_to_from')
      );
    this.availableTimeErrorMessage = [];
    this.availableTimeErrorMessage.push(availableTimeErr);
  }
  async saveDataJobSetting() {
    const saveData = this.userJobSettingInfo.value;
    const skills = saveData.job_setting_skills;
    const arrSkills = [];
    for (const skill of skills) {
      const skill_key = await this.userOnbService.findSkillsByCode(skill._key);
      arrSkills.push(skill_key.data[0]._key);
    }

    saveData.job_setting_skills = arrSkills;
    const locations = saveData.location;
    if (locations) {
      const arrLocations = [];
      locations.forEach((lo) => {
        const loca = lo._key;
        arrLocations.push(loca);
      });
      saveData.location = arrLocations;
    } else {
      saveData.location = [];
    }
    const titles = saveData.job_setting_title;
    if (titles) {
      const arrTitle = [];
      titles.forEach((tit) => {
        const title = tit._key;
        arrTitle.push(title);
      });
      saveData.job_setting_title = arrTitle;
    } else {
      saveData.job_setting_title = [];
    }
    const industrys = saveData.industry;
    if (industrys) {
      const arrIndustrys = [];
      industrys.forEach((ind) => {
        const indus = ind._key;
        arrIndustrys.push(indus);
      });
      saveData.industry = arrIndustrys;
    } else {
      saveData.industry = [];
    }

    saveData.job_setting_skills = saveData.job_setting_skills
      ? saveData.job_setting_skills
      : null;
    const levels = saveData.job_setting_level;
    if (levels) {
      const arrLevels = [];
      levels.forEach((lv) => {
        const level = lv._key;
        arrLevels.push(level);
      });
      saveData.job_setting_level = arrLevels;
    } else {
      saveData.job_setting_level = [];
    }

    saveData.available_time_to = saveData.available_time_to
      ? saveData.available_time_to
      : null;
    saveData.available_time_from = saveData.available_time_from
      ? saveData.available_time_from
      : null;
    saveData.user_id = this.user_id;
    return saveData;
  }

  saveDataUserProfile() {
    debugger
    const saveData = this.userOnboardingInfo.value;
    saveData.ward = saveData.ward ? saveData.ward?._key : null;
    saveData.current_job_title = saveData.current_job_title
      ? saveData.current_job_title?._key
      : null;
    saveData.current_job_level = saveData.current_job_level
      ? saveData.current_job_level?._key
      : null;
    saveData.province_city = saveData.province_city
      ? saveData.province_city?._key
      : null;
    saveData.gender = saveData.gender._key;
    saveData.country_region = saveData.country_region
      ? saveData.country_region?._key
      : null;
    saveData.district = saveData.district ? saveData.district?._key : null;
    saveData.industry_working = saveData.industry_working
      ? saveData.industry_working?._key
      : null;
    saveData.company_working = saveData.company_working
      ? saveData.company_working?._key
      : null;

    this.current_job_skills = saveData.current_job_skills;
    delete saveData.current_job_skills;
    if (this.mode === MODE.NEW) {
      saveData['user_id'] = this.user_id;
      saveData['top_skills'] = [];
    } else {
      saveData['user_id'] = this.authService.getUserID();
    }
    return saveData;
  }

  async saveJobSetting() {
    const jobSettingInfo = await this.saveDataJobSetting();
    await this.userOnbService.saveJobSetting(jobSettingInfo);
  }

  async saveDataUserSkill() {
    this.user_skill._from = 'sys_user/' + this.authService.getUserID();
    const skills = [];
    for (const item of this.current_job_skills) {
      await this.userOnbService.findSkillsByCode(item._key).then((res) => {
        if (res) {
          skills.push(res.data[0]._key);
        }
      });
    }
    if (this.mode == 'EDIT') {
      const _fromSkill = [{ _from: 'sys_user/' + this.user_id }];
      await this.userOnbService.removeBizUserSkill(_fromSkill);
    }

    skills.forEach(async (skill) => {
      this.sort_no += 1;
      this.user_skill.sort_no = this.sort_no;
      this.user_skill._to = 'm_skill/' + skill;
      await this.userOnbService.saveUserSkills([this.user_skill]);
    });
    this.cancelLoadingApp();
  }

  async save() {
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);

    if (
      (this.userOnboardingInfo.valid || this.isChanged) &&
      (this.userJobSettingInfo.valid || this.isChanged) &&
      !this.available_time_error
    ) {
      this.callLoadingApp();
      await this.userOnbService.save(this.saveDataUserProfile()).then((res) => {
        if (res?.status === RESULT_STATUS.OK) {
          this.saveDataUserSkill();
          this.saveJobSetting();
          const message =
            this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
          this.showToastr('', message);
          this.cancelLoadingApp();
          if (this.user_key) {
            this.router.navigate([`user-profile`]);
          } else {
            this.router.navigate([`user-job-alert`]);
          }
        } else {
          this.cancelLoadingApp();
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }
      });
    } else {
      this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
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
          id: 'delete-user-onboading',
        },
      })
      .onClose.subscribe(async (event) => {
        if (event) {
          const _key = [{ _key: this._key }];
          if (this.user_id) {
            await this.userOnbService.remove(_key).then((res) => {
              if (res.status === RESULT_STATUS.OK && res.data.length > 0) {
                this.showToastr('', this.getMsg('I0003'));
                if (this.user_key) {
                  this.close(false);
                } else {
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
          closeOnBackdropClick: false,
          hasBackdrop: true,
          autoFocus: false,
          context: {
            style: { width: '90%' },
            title: this.getMsg('I0006'),
            id: 'back-user-onboading',
          },
        })
        .onClose.subscribe(async (event) => {
          if (event) {
            if (this.user_key) {
              this.close(false);
            } else {
              history.back();
            }
          }
        });
    } else {
      if (this.user_key) {
        this.close(false);
      } else {
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
        } catch {}
      }
    }
  }

  takeGenderValue(value: KeyValueCheckedDto): void {
    if (isObjectFull(value)) {
      this.userOnboardingInfo.controls['gender'].markAsDirty();
      this.userOnboardingInfo.controls['gender'].setValue({
        _key: value._key,
        value: value.name,
      });
    } else {
      this.userOnboardingInfo.controls['gender'].setValue(null);
    }
  }

  takeMasterValueJobSetting(value: any, target: string): void {
    if (isObjectFull(value)) {
      this.userJobSettingInfo.controls[target].markAsDirty();
      this.userJobSettingInfo.controls[target].setValue(value?.value[0]);
    }
  }

  takeMasterValueJobSettings(
    value: KeyValueDto[],
    group: string,
    form: string
  ): void {
    if (isArrayFull(value)) {
      const data = [];
      value.forEach((file) => {
        data.push(file);
      });
      this.userJobSettingInfo.markAsDirty();
      this[group].controls[form].setValue(data);
    } else {
      this[group].controls[form].setValue(null);
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

  takeDatePickerValue(value: number, group: string, form: string, origin = '') {
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
    }
    this.checkDateError();
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

  takeMasterValueSkillJobSetting(val: any, form: string): void {
    if (val.value.length > 0) {
      if (isObjectFull(val)) {
        const data = [];
        val.value.forEach((item) => {
          data.push(item);
        });
        this.userJobSettingInfo.controls[form].markAsDirty();
        this.userJobSettingInfo.controls[form].setValue(data);
        this.isChanged = true;
      } else {
        const msg = this.getMsg('E0022').replace('{0}');
        this.showToastr('', msg, KEYS.WARNING);
      }
    } else {
      this.userJobSettingInfo.controls[form].markAsDirty();
      this.userJobSettingInfo.controls[form].setValue(null);
    }
  }

  takeMasterValueSkillCurrentJob(val: any, form: string): void {
    if (val.value.length > 0) {
      if (isObjectFull(val)) {
        const data = [];
        val.value.forEach((item) => {
          data.push(item);
        });
        this.userOnboardingInfo.controls[form].markAsDirty();
        this.userOnboardingInfo.controls[form].setValue(data);
        this.isChanged = true;
      } else {
        const msg = this.getMsg('E0022').replace('{0}');
        this.showToastr('', msg, KEYS.WARNING);
      }
    } else {
      this.userOnboardingInfo.controls[form].markAsDirty();
      this.userOnboardingInfo.controls[form].setValue(null);
    }
  }

  close(event: boolean) {
    this.nbDialogRef.close(event);
  }

  clear() {
    this.userOnboardingInfo.reset();
    this.userJobSettingInfo.reset();
    for (const index in this.resetUserInfo) {
      this.resetUserInfo[index] = true;
      setTimeout(() => {
        this.resetUserInfo[index] = false;
      }, 100);
    }
    for (const index in this.resetJobSettingInfo) {
      this.resetJobSettingInfo[index] = true;
      setTimeout(() => {
        this.resetJobSettingInfo[index] = false;
      }, 100);
    }
    for (const index in this.isResetCountry) {
      this.isResetCountry[index] = true;
      setTimeout(() => {
        this.isResetCountry[index] = false;
      }, 50);
    }
  }
}
