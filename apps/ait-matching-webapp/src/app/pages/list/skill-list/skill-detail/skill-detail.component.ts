import { AddSkillService } from './../../../../services/add-skill.service';
import { AitAuthService, AitBaseComponent, AitEnvironmentService, AppState, getUserSetting } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { cond } from 'lodash';
import { isObjectFull } from '@ait/shared';
import dayjs from 'dayjs';

@Component({
  selector: 'ait-skill-detail',
  templateUrl: './skill-detail.component.html',
  styleUrls: ['./skill-detail.component.scss']
})
export class SkillDetailComponent extends AitBaseComponent implements OnInit {
  _key: string;
  dateFormat: string;
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

    store.pipe(select(getUserSetting)).subscribe((setting) => {
      if (isObjectFull(setting) && setting['date_format_display']) {
        this.dateFormat = setting['date_format_display'];
      }
    });
  }

  ngOnInit(): void {
    this._key = this.activeRouter.snapshot.paramMap.get('id');
    this.callLoadingApp();
  }


  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase() + ' HH:mm');
    }
  }

  public find = async (condition: any) => {
    const skill = await this.addSkillService.findSkillByKey(condition._key);
   
    const dataForm = {
      data: [],
    };

    dataForm['data'][0] = {};
    Object.keys(skill.data[0]).forEach((key) => {
      if (key === 'category') {
        const value = skill.data[0][key]?.value ? skill.data[0][key]?.value : 'Others';
        dataForm['data'][0][key] = value;
      }else if (key === 'change_at' || key === 'create_at' ) {
        const value = skill.data[0][key];
        dataForm['data'][0][key] = this.getDateFormat(value);
      } else {
        if(key === 'active_flag'){
          const value = skill.data[0][key];
            dataForm['data'][0][key] = value ? 'active' : 'inactive';
        } else {
          const value = skill.data[0][key];
          dataForm['data'][0][key] = value;
        }
      }
    });
    dataForm['errors'] = skill.errors;
    dataForm['message'] = skill.message;
    dataForm['numData'] = skill.numData;
    dataForm['numError'] = skill.numError;
    dataForm['status'] = skill.status;
    return dataForm;
  };

}
