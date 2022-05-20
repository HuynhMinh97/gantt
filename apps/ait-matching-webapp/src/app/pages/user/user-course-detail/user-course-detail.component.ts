import { isArrayFull, isObjectFull, RESULT_STATUS } from '@ait/shared';
import {
  AitEnvironmentService,
  AppState,
  AitAuthService,
  AitAppUtils,
  AitBaseComponent,
  getSettingLangTime,
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import {
  NbToastrService,
  NbLayoutScrollService,
  NbDialogRef,
} from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import dayjs from 'dayjs';
import { MatchingUtils } from '../../../@constants/utils/matching-utils';
import { UserCourseService } from './../../../services/user-course.service';
import { UserCourseDto } from './interface';

@Component({
  selector: 'ait-user-course-detail',
  templateUrl: './user-course-detail.component.html',
  styleUrls: ['./user-course-detail.component.scss'],
})
export class UserCourseDetailComponent
  extends AitBaseComponent
  implements OnInit {
  user_key: any = '';
  stateUserCourse = {};
  dateFormat: string;
  constructor(
    public activeRouter: ActivatedRoute,
    public userCourseService: UserCourseService,
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
      page: 'user_course',
    });
    this.user_key = this.activeRouter.snapshot.paramMap.get('id');
    this.store.pipe(select(getSettingLangTime)).subscribe((setting) => {
      if (setting) {
        const display = setting?.date_format_display;
        this.dateFormat = MatchingUtils.getFormatYearMonth(display);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.callLoadingApp();
    if (this.user_key) {
      await this.userCourseService.findCourseByKey(this.user_key).then((r) => {
        if (r.status === RESULT_STATUS.OK) {
          const data = r.data[0];
          this.stateUserCourse = data;
        }
      });
    }
  }

  async getMasterData() {
    this.getMasterData();
    try {
      if (!this.dateFormat) {
        const masterValue = await this.getUserSettingData('USER_SETTING');
        const setting = await this.findUserSettingCode();
        if (isObjectFull(setting) && isArrayFull(masterValue)) {
          const format = setting['date_format_display'];
          const data = masterValue.find((item) => item.code === format);
          if (data) {
            this.dateFormat = data['name'];
          }
        }
      }
    } catch (e) {}
  }

  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase());
    }
  }

  public find = async (key = {}) => {
    if (isObjectFull(key)) {
      return await this.userCourseService
        .findCourseByKey(this.user_key)
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            const data = r.data[0];
            this.stateUserCourse = JSON.parse(JSON.stringify(data));
            const datas = [];
            let dayFrom = '';
            let dayTo = '';
            if (this.stateUserCourse['start_date_from']) {
              dayFrom = this.getDateFormat(
                this.stateUserCourse['start_date_from']
              );
            }
            if (this.stateUserCourse['start_date_to']) {
              dayTo = this.getDateFormat(this.stateUserCourse['start_date_to']);
            }
            if (dayFrom && !dayTo) {
              this.stateUserCourse['start_date'] = dayFrom;
            } else if (!dayFrom && dayTo) {
              this.stateUserCourse['start_date'] = dayTo;
            } else if (dayFrom && dayTo) {
              this.stateUserCourse['start_date'] = dayFrom + '  ~  ' + dayTo;
            } else {
              this.stateUserCourse['start_date'] = '';
            }
            const course = {};
            for (const item in this.stateUserCourse) {
              if (isObjectFull(this.stateUserCourse[item])) {
                if (item == 'file') {
                  course[item] = this.stateUserCourse[item];
                } else {
                  course[item] = this.stateUserCourse[item].value;
                }
              } else {
                course[item] = this.stateUserCourse[item];
              }
            }
            datas.push(course);
            return { data: datas };
          }
        });
    }
  };
}
