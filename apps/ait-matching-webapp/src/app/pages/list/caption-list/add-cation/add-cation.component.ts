import { AddCaptionService } from './../../../../services/add-caption.service';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitRenderPageService,
  AppState,
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'ait-add-cation',
  templateUrl: './add-cation.component.html',
  styleUrls: ['./add-cation.component.scss'],
})
export class AddCationComponent extends AitBaseComponent implements OnInit {
  caption_key: string;
  group_no = 1;
  constructor(
    public activeRouter: ActivatedRoute,
    private addCaptionService: AddCaptionService,

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
    this.caption_key = this.activeRouter.snapshot.paramMap.get('id');
    this.cancelLoadingApp();
  }

  public save = async (condition = {}) => {
    let page_key
    let module_key

    const saveData = {};
    saveData['name'] = {};
    Object.keys(condition).forEach((key) => {
      if (key.includes('page')){
        page_key = condition[key];
      }
      const value = condition[key];
      key.includes('en_US')
        ? (saveData['name']['en_US'] = value)
        : key.includes('ja_JP')
        ? (saveData['name']['ja_JP'] = value)
        : key.includes('vi_VN')
        ? (saveData['name']['vi_VN'] = value)
        : (saveData[key] = value);
    });
    const page = await this.addCaptionService.findPageByKey(page_key);
    const module = await this.addCaptionService.findModuleByKey(module_key);
    saveData['page'] = page
    saveData['module'] = module;
    saveData['group_no'] = this.group_no;
    saveData['active_flag'] = true;
    return;
  };
}
