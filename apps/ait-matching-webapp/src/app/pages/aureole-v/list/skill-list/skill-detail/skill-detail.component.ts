import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { SkillRegisterService } from '../../../../../services/add-skill.service';

@Component({
  selector: 'ait-skill-detail',
  templateUrl: './skill-detail.component.html',
  styleUrls: ['./skill-detail.component.scss'],
})
export class SkillDetailComponent extends AitBaseComponent implements OnInit {
  skillKey: string;
  skill: any;
  constructor(
    private skillRegisterService: SkillRegisterService,
    private activatedRoute: ActivatedRoute,
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

    this.skillKey = this.activatedRoute.snapshot.paramMap.get('id');

    this.setModulePage({
      module: 'skill',
      page: 'skill-detail',
    });

  }

  ngOnInit(): void {
    this.getSkillByKey( this.skillKey);
  }

  getSkillByKey(_key: string) {
    this.cancelLoadingApp();
    try {
      this.skillRegisterService.findSkillByKey(_key).then((res) => {
         this.skill = res.data[0];
      });
      
      
    } catch (error) {
      this.callLoadingApp();
    }
  }
}
