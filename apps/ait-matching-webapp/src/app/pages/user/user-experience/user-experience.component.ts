import { UserExperienceService } from './../../../services/user-experience.service';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries

import { Component,  OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  NbLayoutScrollService,
  NbToastrService,
} from '@nebular/theme';
import {  Store } from '@ngrx/store';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
} from '@ait/ui';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'ait-user-experience',
  templateUrl: './user-experience.component.html',
  styleUrls: ['./user-experience.component.scss'],
})
export class UserExperienceComponent
  extends AitBaseComponent
  implements OnInit {
  // Create form group
 
  userExperience_key = '';

  constructor(
    private userExperienceService: UserExperienceService,
    private formBuilder: FormBuilder,
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
      module: 'user',
      page: 'user_experience',
    });

   
  }

   ngOnInit(): void{
    this.userExperience_key = this.activeRouter.snapshot.paramMap.get('id');
   this.callLoadingApp();
  
  }

  public save = async (condition = {}) => {
    const saveData = {};
    saveData['user_id'] = this.authService.getUserID();
    Object.keys(condition).forEach((key) => {
      const value = condition[key];
      saveData[key] = value;
    });
    return await this.userExperienceService.save([saveData]);
  };

}
