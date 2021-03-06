import { AddSkillService } from './../../../../services/add-skill.service';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';
import { async } from '@angular/core/testing';

@Component({
  selector: 'ait-add-skill',
  templateUrl: './add-skill.component.html',
  styleUrls: ['./add-skill.component.scss'],
})
export class AddSkillComponent extends AitBaseComponent implements OnInit {
  skill_key: string;

  constructor(
    public activeRouter: ActivatedRoute,
    private addSkillService: AddSkillService,

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
  }

  ngOnInit(): void {
    this.skill_key = this.activeRouter.snapshot.paramMap.get('id');
    this.cancelLoadingApp();
    this.find();
  }

  public find = async() => {
    const category_others = {
      value: 'Others',
      _key: 'ed3d2608-87b9-4d85-9e15-829d24675bc1'
    }
      const skillData = {};
      skillData['data'] = {};
      skillData['data'][0] = {};
      const skill = await this.addSkillService.findSkillByKey(this.skill_key);
      skillData['data'][0]['name'] = skill.data[0]?.name;
      skillData['data'][0]['active_flag'] = skill.data[0]?.active_flag;
      skillData['data'][0]['category'] = skill.data[0]?.category ? skill.data[0]?.category : category_others  ;
      return skillData;
  }

  public save = async (condition = {}) => {
    const arrSortNo = [];
    const sort_no = await this.addSkillService.getMaxSortNo().then((res) => {
      res.data.forEach((r) => arrSortNo.push(r.sort_no));
    });
    const max = Math.max(...arrSortNo);

    const saveData = {};
    Object.keys(condition).forEach((key) => {
      const value = condition[key];
      saveData[key] = value;
    });
    saveData['sort_no'] = max + 1;
    saveData['active_flag'] = condition['active_flag'] ? condition['active_flag'] : false ;
    if (this.skill_key){ saveData['_key'] = this.skill_key;}
    return await this.addSkillService.saveSkill(saveData);
  };
}
