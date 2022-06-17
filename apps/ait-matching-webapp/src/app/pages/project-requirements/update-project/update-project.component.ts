import { RegisterProjectService } from '../../../services/register-project.service';
import { UserOnboardingService } from '../../../services/user-onboarding.service';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitTranslationService,
  AppState,
  getUserSetting,
  MODE,
} from '@ait/ui';
import { Component, ElementRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserListService } from '../../../services/user-list.service';
import {
  isArrayFull,
  isObjectFull,
  KEYS,
  KeyValueDto,
  RESULT_STATUS,
} from '@ait/shared';
import dayjs from 'dayjs';
import { AddRoleService } from '../../../services/add-role.service';
import { BizProjectService } from '../../../services/biz_project.service';
import { RecommencedUserService } from '../../../services/recommenced-user.service';

@Component({
  selector: 'ait-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.scss'],
})
export class UpdateProjectComponent extends AitBaseComponent implements OnInit {
  project_key: string;
  projectForm: FormGroup;
  projectDetailForm: FormGroup;
  project_skill_save: any;
  project_skill = [];
  project_title = [];
  project_industry = [];
  project_level = [];
  project_location = [];

  availableTimeErrorMessage = [];
  dateFormat: string;
  candidate_list = [];
  projectFormClone: any;
  projectDetailFormClone: any;
  userProjectClone: any;
  tableComponents: any[] = [1];
  isTableIncluded = true;
  isExpandIncluded = true;
  isExpan = true;
  isTableExpan = true;
  isReset = false;
  isLangJP = false;
  isSubmit = false;
  isClear = false;
  isChanged = false;
  isDisplay = false;
  available_time_error = false;
  resetProjectInfo = {
    name: false,
    industry: false,
    title: true,
    skill: false,
    location: false,
    level: false,
    description: true,
    valid_time_to: false,
    valid_time_from: false,
    remark: false,
  };
  projectSkillSave = {
    _from: '',
    _to: '',
    level: '',
  };
  user_list = [];
  employeeList: any[] = [];
  mode = MODE.NEW;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
    private element: ElementRef,
    private userOnbService: UserOnboardingService,
    private registerProjectService: RegisterProjectService,
    private userListService: UserListService,
    private addRoleService: AddRoleService,
    private bizProjectService: BizProjectService,
    private recommencedService: RecommencedUserService,
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

    store.pipe(select(getUserSetting)).subscribe((setting) => {
      if (isObjectFull(setting) && setting['date_format_display']) {
        this.dateFormat = setting['date_format_display'];
      }
    });

    this.projectForm = this.formBuilder.group({
      name: new FormControl(null, Validators.required),
      _key: new FormControl(null),
      location: new FormControl(null, Validators.required),
      title: new FormControl(null, Validators.required),
      valid_time_from: new FormControl(null, Validators.required),
      valid_time_to: new FormControl(null),
      level: new FormControl(null, Validators.required),
      industry: new FormControl(null, Validators.required),
      skills: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      remark: new FormControl(null),
    });

    this.projectDetailForm = this.formBuilder.group({
      _key: new FormControl(null),
      customer: new FormControl(null),
      project_code: new FormControl(null),
      person_in_charge: new FormControl(null),
      status: new FormControl(null),
    });
  }

  async ngOnInit(): Promise<void> {
    this.project_key = this.activeRouter.snapshot.paramMap.get('id');
    if (this.project_key) {
      this.mode = MODE.EDIT;
    }
    try {
      await this.find();
      await this.getEmployee();
      await this.getAllUser();
    } catch {}

    await this.projectForm.valueChanges.subscribe((data) => {
      this.checkAllowSave();
    });
    await this.projectDetailForm.valueChanges.subscribe((data) => {
      this.checkAllowSaveProjectDetail();
    });
    this.cancelLoadingApp();
  }

  async find(data = {}) {
    try {
      const dataFind = [];
      await this.findProjectByKey();
      await this.findSkillProject();
      await this.findTitleProject();
      await this.findIndustryProject();
      await this.findLevelProject();
      await this.findLocationProject();
      await this.findProjectDetail();
      await dataFind.push(this.projectForm.value);
      this.projectFormClone = this.projectForm.value;
      this.projectDetailFormClone = this.projectDetailForm.value;
    } catch (error) {}
  }

  async findProjectDetail() {
    const result = await this.bizProjectService.findDetailByProject_key(
      this.project_key
    );
    this.projectDetailForm.patchValue({ ...result.data[0] });
  }

  async getCandidate() {
    const result = await this.registerProjectService.getBizProjectUser(
      this.project_key
    );
    this.candidate_list = result.data;
  }

  async findProjectByKey() {
    const res = await this.registerProjectService.findProjectAitByKey(
      this.project_key
    );
    const data = res.data[0];
    if (res.data.length > 0) {
      await this.projectForm.patchValue({ ...data });
      this.userProjectClone = this.projectForm.value;
    } else {
      this.router.navigate([`/404`]);
    }
  }

  async findSkillProject() {
    try {
      const _key = this.project_key;
      await this.registerProjectService
        .findSkillProject(_key)
        .then(async (res) => {
          const listSkills = [];
          for (const skill of res.data) {
            listSkills.push({
              _key: skill?.skill?._key,
              value: skill?.skill?.value,
            });
          }
          if (listSkills[0]['_key']) {
            this.project_skill = listSkills;
            await this.projectForm.controls['skills'].setValue([...listSkills]);
          }

          this.cancelLoadingApp();
        });
    } catch {
      this.cancelLoadingApp();
    }
  }

  async findLevelProject() {
    try {
      const _key = this.project_key;
      await this.registerProjectService
        .findLevelProject(_key)
        .then(async (res) => {
          const listLevel = [];
          for (const item of res.data) {
            listLevel.push({
              _key: item?.level?._key,
              value: item?.level?.value,
            });
          }
          if (listLevel[0]['_key']) {
            this.project_level = listLevel;
            await this.projectForm.controls['level'].setValue([...listLevel]);
          }
          this.cancelLoadingApp();
        });
    } catch {
      this.cancelLoadingApp();
    }
  }

  async findIndustryProject() {
    try {
      const _key = this.project_key;
      await this.registerProjectService
        .findIndustryProject(_key)
        .then(async (res) => {
          const listIndustry = [];
          for (const item of res.data) {
            listIndustry.push({
              _key: item?.industry?._key,
              value: item?.industry?.value,
            });
          }
          if (listIndustry[0]['_key']) {
            this.project_industry = listIndustry;
            await this.projectForm.controls['industry'].setValue([
              ...listIndustry,
            ]);
          }
          this.cancelLoadingApp();
        });
    } catch {
      this.cancelLoadingApp();
    }
  }

  async findTitleProject() {
    try {
      const _key = this.project_key;
      await this.registerProjectService
        .findTitleProject(_key)
        .then(async (res) => {
          const listTitles = [];
          for (const item of res.data) {
            listTitles.push({
              _key: item?.title?._key,
              value: item?.title?.value,
            });
          }
          if (listTitles[0]['_key']) {
            this.project_title = listTitles;
            await this.projectForm.controls['title'].setValue([...listTitles]);
          }
          this.cancelLoadingApp();
        });
    } catch {
      this.cancelLoadingApp();
    }
  }

  async findLocationProject() {
    try {
      const _key = this.project_key;
      await this.registerProjectService
        .findLocationProject(_key)
        .then(async (res) => {
          const listLocation = [];
          for (const item of res.data) {
            listLocation.push({
              _key: item?.location?._key,
              value: item?.location?.value,
            });
          }
          if (listLocation[0]['_key']) {
            this.project_location = listLocation;
            await this.projectForm.controls['location'].setValue([
              ...listLocation,
            ]);
          }
          this.cancelLoadingApp();
        });
    } catch {
      this.cancelLoadingApp();
    }
  }

  toggleExpan = () => (this.isExpan = !this.isExpan);
  toggleTableExpan = () => (this.isTableExpan = !this.isTableExpan);

  async getAllUser() {
    const dataSearch = [];
    await this.userListService.find().then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        const data = res.data;
        if (data.length > 0) {
          data.forEach(async (element) => {
            const dataFormat = {};
            dataFormat['title'] = element?.username;
            dataFormat['value'] = element?._key;
            dataSearch.push(dataFormat);
          });
        }
      }
    });
    this.user_list = dataSearch;
    return dataSearch;
  }

  async getEmployee() {
    await this.addRoleService.getEmployee().then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        const data = [];
        (res.data || []).forEach((e: any) =>
          data.push({ _key: e?._key, value: e?.full_name })
        );
        this.employeeList = data;
      }
    });
  }

  async save() {
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);
    if (this.projectForm.valid) {
      await this.saveBizProject();
    } else {
      this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
      this.scrollIntoError();
    }
  }

  scrollIntoError() {
    for (const key of Object.keys(this.projectForm.controls)) {
      if (this.projectForm.controls[key].invalid) {
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

  async saveBizProject() {
    try {
      const projectUser = this.registerProjectService.data_save;
      const saveProjectDetail = this.projectDetailForm.value;
      await this.bizProjectService
        .save(this.saveDataProject())
        .then(async (res) => {
          await this.saveProjectSkill();
          if (res.status === RESULT_STATUS.OK) {
            if (isObjectFull(saveProjectDetail)) {
              await this.saveProjectDetail();
            }

            if (isArrayFull(projectUser)) {
              projectUser.forEach((item) => {
                item['project_key'] = this.project_key;
                this.registerProjectService.saveTeamMember(item).then((r) => {
                  if (r.status === RESULT_STATUS.OK) {
                    this.showToastr('', this.getMsg('I0005'));
                    localStorage.setItem('biz_project_key', this.project_key);
                    this.router.navigate([`/requirement-list`]);
                  } else {
                    this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
                  }
                });
              });
            } else {
              this.showToastr('', this.getMsg('I0005'));
              localStorage.setItem('biz_project_key', this.project_key);
              this.router.navigate([`/requirement-list`]);
            }
          } else {
            this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
          }
        });
    } catch (e) {}
  }

  takeInputValue(value: string, group: string, form: string): void {
    if (value) {
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
    } else {
      this[group].controls[form].setValue(null);
    }
  }

  takeMasterValue(value: any, target: string): void {
    if (isObjectFull(value)) {
      this.projectDetailForm.controls[target].markAsDirty();
      this.projectDetailForm.controls[target].setValue(value?.value[0]);
    } else {
      this.projectDetailForm.controls[target].setValue(null);
    }
  }

  takeMasterValues(value: KeyValueDto[], group: string, form: string): void {
    if (isArrayFull(value)) {
      const data = [];
      value.forEach((file) => {
        data.push(file);
      });
      this.projectForm.markAsDirty();
      this[group].controls[form].setValue(data);
    } else {
      this[group].controls[form].setValue(null);
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

  checkDateError() {
    const name = 'available_time_error';
    const valueFrom = this.projectForm.controls['valid_time_from'].value;
    const valueTo = this.projectForm.controls['valid_time_to'].value;

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
      .replace('{0}', this.translateService.translate('valid_time_to'))
      .replace('{1}', this.translateService.translate('valid_time_from'));
    this.availableTimeErrorMessage = [];
    this.availableTimeErrorMessage.push(availableTimeErr);
  }

  takeMasterValueSkill(val: any, form: string): void {
    if (val.value.length > 0) {
      if (isObjectFull(val)) {
        const data = [];
        val.value.forEach((item) => {
          data.push(item);
        });
        this.projectForm.controls[form].markAsDirty();
        this.projectForm.controls[form].setValue(data);
        this.isChanged = true;
      } else {
        const msg = this.getMsg('E0022').replace('{0}');
        this.showToastr('', msg, KEYS.WARNING);
      }
    } else {
      this.projectForm.controls[form].markAsDirty();
      this.projectForm.controls[form].setValue(null);
    }
  }

  checkAllowSave() {
    const projectInfo = { ...this.projectForm.value };
    const projectInfoClone = { ...this.projectFormClone };
    this.isChanged = !AitAppUtils.isObjectEqual(
      { ...projectInfo },
      { ...projectInfoClone }
    );
  }

  checkAllowSaveProjectDetail() {
    const projectDetailInfo = { ...this.projectDetailForm.value };
    const projectDetailInfoClone = { ...this.projectDetailFormClone };
    this.isChanged = !AitAppUtils.isObjectEqual(
      { ...projectDetailInfo },
      { ...projectDetailInfoClone }
    );
  }

  saveDataProject() {
    const saveData = this.projectForm.value;
    this.project_skill_save = saveData.skills;
    delete saveData.skills;
    if (!saveData['valid_time_to'] && saveData['valid_time_from']) {
      const start_plan = new Date(saveData['valid_time_from']);
      const end_plan = new Date(
        start_plan.getFullYear(),
        start_plan.getMonth() + 1,
        0
      );
      saveData['valid_time_to'] = end_plan.setMilliseconds(100);
    }
    const titles = saveData.title;
    if (isArrayFull(titles)) {
      const arrTitle = [];
      titles.forEach((tit) => {
        const title = tit._key;
        arrTitle.push(title);
      });
      saveData.title = arrTitle;
    } else {
      saveData.title = [];
    }
    const industrys = saveData.industry;
    if (isArrayFull(industrys)) {
      const arrIndustrys = [];
      industrys.forEach((ind) => {
        const indus = ind._key;
        arrIndustrys.push(indus);
      });
      saveData.industry = arrIndustrys;
    } else {
      saveData.industry = [];
    }
    const locations = saveData.location;
    if (isArrayFull(locations)) {
      const arrLocations = [];
      locations.forEach((lo) => {
        const loca = lo._key;
        arrLocations.push(loca);
      });
      saveData.location = arrLocations;
    } else {
      saveData.location = [];
    }

    const levels = saveData.level;
    if (isArrayFull(levels)) {
      const arrLevels = [];
      levels.forEach((lv) => {
        const level = lv._key;
        arrLevels.push(level);
      });
      saveData.level = arrLevels;
    } else {
      saveData.level = [];
    }
    return saveData;
  }

  clear() {
    this.project_skill = [];
    this.project_title = [];
    this.project_industry = [];
    this.project_level = [];
    this.project_location = [];
    this.projectForm.reset();
    this.projectDetailForm.reset();
    for (const index in this.resetProjectInfo) {
      this.resetProjectInfo[index] = true;
      setTimeout(() => {
        this.resetProjectInfo[index] = false;
      }, 150);
    }
  }

  async resetForm() {
    for (const index in this.resetProjectInfo) {
      this.resetProjectInfo[index] = true;
      setTimeout(() => {
        this.resetProjectInfo[index] = false;
      }, 150);
    }
    await this.find();
  }

  async findCandidates() {
    localStorage.setItem('biz_project_key', this.project_key);
    this.router.navigate([`/recommenced-user`]);
  }

  async saveProjectDetail() {
    const saveData = this.projectDetailForm.value;
    if (saveData.person_in_charge._key) {
      saveData.person_in_charge = saveData.person_in_charge._key;
    }
    if (isObjectFull(saveData)) {
      const projectDetial = {};
      if (saveData._key) {
        projectDetial['_key'] = saveData._key;
      }
      projectDetial['project'] = this.project_key;
      projectDetial['customer'] = saveData.customer?._key || null;
      projectDetial['project_code'] = saveData.project_code || null;
      projectDetial['person_in_charge'] = saveData.person_in_charge;
      projectDetial['status'] = saveData.status?._key;
      await this.bizProjectService.saveBizProjectDetail(projectDetial);
    }
  }

  async saveProjectSkill() {
    this.projectSkillSave._from = 'biz_project/' + this.project_key;
    const skills = this.project_skill_save;
    if (this.project_key) {
      const _fromSkill = [{ _from: 'biz_project/' + this.project_key }];
      try {
        await this.bizProjectService.removeBizProjectSkill(_fromSkill);
      } catch {}
    }
    try {
      for (const skill of skills) {
        this.projectSkillSave._to = 'm_skill/' + skill._key;
        this.projectSkillSave.level = skill.level;
        await this.bizProjectService.saveBizProjectSkill([
          this.projectSkillSave,
        ]);
      }
    } catch {}
    this.cancelLoadingApp();
  }
}
