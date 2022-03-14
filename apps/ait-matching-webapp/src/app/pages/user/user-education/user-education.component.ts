import { UserEducationService } from './../../../services/user-education.service';

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, } from '@angular/router';
import {
  NbLayoutScrollService,
  NbToastrService,
} from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
  getSettingLangTime,
  MODE,
} from '@ait/ui';
import { Apollo } from 'apollo-angular';
import { MatchingUtils } from '../../../../app/@constants/utils/matching-utils';

@Component({
  selector: 'ait-user-education',
  templateUrl: './user-education.component.html',
  styleUrls: ['./user-education.component.scss'],
})
export class UserEducationComponent extends AitBaseComponent implements OnInit {
 
  userEducation_key = '';

  constructor(
    private userEducationService: UserEducationService,
    public activeRouter: ActivatedRoute,
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
      module: 'add_education',
      page: 'add_education',
    });
  }

   ngOnInit(): void {
    this.userEducation_key = this.activeRouter.snapshot.paramMap.get('id');
   this.cancelLoadingApp();
  }

  public save = async (condition = {}) => {
    const saveData = {};
    saveData['user_id'] = this.authService.getUserID();
    Object.keys(condition).forEach((key) => {
      const value = condition[key];
      saveData[key] = value;
    });
    return await this.userEducationService.save([saveData]);
  };

}
