// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { RESULT_STATUS } from './../../../../../../../libs/shared/src/lib/commons/enums';
import { UserLanguageService } from './../../../services/user-language.service';

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
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
  selector: 'ait-user-language',
  templateUrl: './user-language.component.html',
  styleUrls: ['./user-language.component.scss'],
})
export class UserLanguageComponent extends AitBaseComponent implements OnInit {
  // Create form group
  userLanguage: FormGroup;
  userLanguageClone: any;
  defaultValueDate = new Date().setHours(0, 0, 0, 0);
  userLanguage_key = '';

  constructor(
    private formBuilder: FormBuilder,
    private userLanguageService: UserLanguageService,
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
    

    this.userLanguage = this.formBuilder.group({
      language: new FormControl(null, [Validators.required]),
      proficiency: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.userLanguage_key = this.activeRouter.snapshot.paramMap.get('id');
    this.cancelLoadingApp();
  }

  public save = async (condition = {}) => {
    const userId = await this.authService.getUserID();
    const languages = await this.userLanguageService.findUserLanguageByUserId(userId);
    const language_list = languages.data;
    let isExist = false;
    language_list.forEach((lang) => {
      if(lang['language']._key.includes(condition['language'])){
        isExist = true;
      }
    })
    if (!isExist) {
      const saveData = {};
      saveData['user_id'] = userId;
      Object.keys(condition).forEach((key) => {
        const value = condition[key];
        saveData[key] = value;
      });
      return await this.userLanguageService.save([saveData]);
    }  else {
      const dataForm = {
        data: [],
      };
      dataForm['status'] = RESULT_STATUS.ERROR;
      return dataForm;
    }
  };
}
