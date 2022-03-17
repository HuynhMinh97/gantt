import { RESULT_STATUS } from '@ait/shared';
import { AitEnvironmentService, AppState, AitAuthService, AitAppUtils, AitBaseComponent } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NbToastrService, NbLayoutScrollService, NbDialogRef } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserCourseService } from './../../../services/user-course.service';
import { UserCourseDto } from './interface';

@Component({
  selector: 'ait-user-course-detail',
  templateUrl: './user-course-detail.component.html',
  styleUrls: ['./user-course-detail.component.scss']
})
export class UserCourseDetailComponent extends AitBaseComponent implements OnInit {

  user_key: any = '';
  stateUserCourse = {} as UserCourseDto;
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
  }

  async ngOnInit(): Promise<void> {
    this.callLoadingApp();
    if (this.user_key) {
      await this.userCourseService
        .findCourseByKey(this.user_key)
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            const data = r.data[0];
            this.stateUserCourse = data;

          }
        })
    }
  }
 
}
