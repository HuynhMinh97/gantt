import { AddSkillService } from './../../../../services/add-skill.service';
import { AitAuthService, AitBaseComponent, AitEnvironmentService, AppState } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'ait-skill-detail',
  templateUrl: './skill-detail.component.html',
  styleUrls: ['./skill-detail.component.scss']
})
export class SkillDetailComponent extends AitBaseComponent implements OnInit {
  _key: string;

  constructor(
    public activeRouter: ActivatedRoute,
    private addSkillService: AddSkillService,

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
    debugger
    const result = await this.addSkillService.findCategoryByKey(
      condition._key
    );
    const dataForm = {
      data: [],
    };

    dataForm['data'][0] = {};
    // Object.keys(result.data[0]).forEach((key) => {
    //   if (key === 'school') {
    //     const value = result.data[0][key].value;
    //     dataForm['data'][0][key] = value;
    //   } else {
    //         const value = result.data[0][key];
    //         dataForm['data'][0][key] = value;
    //   }
    // });
    dataForm['errors'] = result.errors;
    dataForm['message'] = result.message;
    dataForm['numData'] = result.numData;
    dataForm['numError'] = result.numError;
    dataForm['status'] = result.status;
    return dataForm;
  };

}
