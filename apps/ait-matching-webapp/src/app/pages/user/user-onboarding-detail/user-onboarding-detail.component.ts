import { JobSettingDto } from './../user-onboarding/interface';
import { isObjectFull, RESULT_STATUS } from '@ait/shared';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
  getUserSetting,
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import {
  NbToastrService,
  NbLayoutScrollService,
  NbDialogRef,
} from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserSkillsService } from '../../../services/user-skills.service';
import { UserOnboardingDto } from '../user-onboarding/interface';
import { UserOnboardingService } from './../../../services/user-onboarding.service';
import dayjs from 'dayjs';

@Component({
  selector: 'ait-user-onboarding-detail',
  templateUrl: './user-onboarding-detail.component.html',
  styleUrls: ['./user-onboarding-detail.component.scss'],
})
export class UserOnboardingDetailComponent
  extends AitBaseComponent
  implements OnInit {
  user_key: any = '';
  stateUserOnboarding = {} as UserOnboardingDto;
  jobSettingInfo = {} as JobSettingDto;
  dataCountry: any;
  dateFormat: string;

  constructor(
    private formBuilder: FormBuilder,
    private userSkillsService: UserSkillsService,
    private router: Router,
    public activeRouter: ActivatedRoute,
    private userOnbService: UserOnboardingService,
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

    store.pipe(select(getUserSetting)).subscribe((setting) => {
      if (isObjectFull(setting) && setting['date_format_display']) {
        this.dateFormat = setting['date_format_display'];
      }
    });

    this.user_key = this.activeRouter.snapshot.paramMap.get('id');
  }

  async ngOnInit(): Promise<void> {
    this.callLoadingApp();
    await this.userOnbService.findJobSetting(this.user_key).then((r) => {
      if (r.status === RESULT_STATUS.OK ) {
        const jobSettingData = r.data[0];
        if (jobSettingData !== undefined) {
          Object.keys(jobSettingData).forEach((key) => {
            if (key === 'job_setting_skills' || key === 'industry') {
              const arr = [];
              const obj = jobSettingData[key];
              obj.forEach((item) => {
                arr.push(item.value);
              });
              const list = arr.join(', ');
              if (key.includes('job_setting_skills')) {
                this.jobSettingInfo['skills'] = list;
              } else {
                this.jobSettingInfo['industryList'] = list;
              }
            } else {
              const value = jobSettingData[key];
              this.jobSettingInfo[key] = value;
            }
          });
          // this.jobSettingInfo = jobSettingData;
          const timeFrom = this.jobSettingInfo.available_time_from;
          const timeTo = this.jobSettingInfo.available_time_to;
          if (timeFrom != null && timeTo != null) {
            const availebleTime =
              this.getDateFormat(timeFrom) + ' ~ ' + this.getDateFormat(timeTo);
            this.jobSettingInfo['available_time'] = availebleTime;
          } else {
            this.jobSettingInfo.available_time = null;
          }
        }
        else {
           this.findSkills();
           this.userOnbService
            .findUserOnboardingByKey(this.user_key)
            .then(async (r) => {
              if (r.status === RESULT_STATUS.OK) {
                const data = r.data[0];
                Object.keys(data).forEach((key) => {
                  const value = data[key];
                  this.stateUserOnboarding[key] = value;
                });
              }
            });
        }
      } 
    });
    
    setTimeout(() => {
      this.cancelLoadingApp();
    }, 500);
  }
  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase());
    }
  }

  async findSkills() {
    const from = 'sys_user/' + this.user_key;
    await this.userOnbService.findSkillsByFrom(from).then(async (res) => {
      const listSkills = [];
      for (const skill of res.data) {
        listSkills.push(skill?.skills);
      }
      const arr = [];
      listSkills.forEach((item) => {
        arr.push(item.value);
      });
      const list = arr.join(', ');
      this.stateUserOnboarding['skills'] = list;
    });
  }
}
