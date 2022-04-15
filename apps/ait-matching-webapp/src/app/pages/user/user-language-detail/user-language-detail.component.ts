import { AitAuthService, AitBaseComponent, AitEnvironmentService, AppState } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserLanguageService } from '../../../services/user-language.service';

@Component({
  selector: 'ait-user-language-detail',
  templateUrl: './user-language-detail.component.html',
  styleUrls: ['./user-language-detail.component.scss']
})
export class UserLanguageDetailComponent extends AitBaseComponent implements OnInit {
  _key:string;
  constructor(
    private userLanguageService: UserLanguageService,
    public activeRouter: ActivatedRoute,

    store: Store<AppState>,
    apollo: Apollo,
    env: AitEnvironmentService,
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

   }

  ngOnInit(): void {
    this._key = this.activeRouter.snapshot.paramMap.get('id');
    this.callLoadingApp();
  }

  public find = async (condition: any) => {
    const result = await this.userLanguageService.findUserLanguageByKey(
      condition._key
    );
    const dataForm = {
      data: [],
    };

    dataForm['data'][0] = {};
    Object.keys(result.data[0]).forEach((key) => {
      if (key === 'language') {
        const value = result.data[0][key].value;
        
        dataForm['data'][0][key] = value;
      } 
      if (key === 'proficiency') {
        const value = result.data[0][key].value;
        
        dataForm['data'][0][key] = value;
      } 
    });
    
    
    dataForm['errors'] = result.errors;
    dataForm['message'] = result.message;
    dataForm['numData'] = result.numData;
    dataForm['numError'] = result.numError;
    dataForm['status'] = result.status;
    return dataForm;
  };

}

