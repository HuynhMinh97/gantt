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

@Component({
  selector: 'ait-add-skill',
  templateUrl: './add-skill.component.html',
  styleUrls: ['./add-skill.component.scss'],
})
export class AddSkillComponent extends AitBaseComponent implements OnInit {
  skill_key: string

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
  }

  public save = async (condition = {}) => {
    
    const arrSortNo = [];
    const sort_no = await this.addSkillService.getMaxSortNo().then((res) => {
      
       res.data.forEach((r) => arrSortNo.push(r.sort_no))
    });
    const max = Math.max(...arrSortNo)
     
    
    const saveData = {};
    Object.keys(condition).forEach((key) => {
        const value = condition[key];
        saveData[key] = value;
    });
    saveData['sort_no'] = max + 1;
    saveData['active_flag'] = true;
    return await this.addSkillService.saveSkill(saveData);
  };
}
