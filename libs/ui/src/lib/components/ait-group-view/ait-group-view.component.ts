/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { RESULT_STATUS } from '@ait/shared';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService, NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { AitEnvironmentService } from '../../services/ait-environment.service';
import { AitAuthService } from '../../services/common/ait-auth.service';
import { AitMasterDataService } from '../../services/common/ait-master-data.service';
import { AitRenderPageService } from '../../services/common/ait-render-page.service';
import { AitSaveTempService } from '../../services/common/ait-save-temp.service';
import { AitUserService } from '../../services/common/ait-user.service';
import { AppState } from '../../state/selectors';
import { AitBaseComponent } from '../base.component';

@Component({
  selector: 'ait-group-view',
  templateUrl: './ait-group-view.component.html',
  styleUrls: ['./ait-group-view.component.scss']
})
export class AitGroupViewComponent extends AitBaseComponent implements OnInit {
  viewForm: FormGroup;
  @Input() page: string;
  @Input() module: string;
  @Input() _key = '';
  moduleKey = '';
  pageKey = '';
  groupKey = '';
  collection = '';
  viewComponents: any;
  cloneData: any;
  multiLang: string[] = [];
  leftSide: any[] = [];
  rightSide: any[] = [];

  constructor(
    private renderPageService: AitRenderPageService,
    public router: Router,
    public store: Store<AppState>,
    private dialogService: NbDialogService,
    authService: AitAuthService,
    userService: AitUserService,
    toastrService: NbToastrService,
    env: AitEnvironmentService,
    layoutScrollService: NbLayoutScrollService,
    apollo: Apollo,
    saveTempService: AitSaveTempService,
    private masterDataService: AitMasterDataService
  ) {
    super(
      store,
      authService,
      apollo,
      userService,
      env,
      layoutScrollService,
      toastrService,
      saveTempService
    );
  }

  ngOnInit(): void {
    this.setupData();
  }

  async setupData() {
    this.callLoadingApp();
    try {
      const resModule = await this.renderPageService.findModule({
        code: this.module,
      });
      const resPage = await this.renderPageService.findPage({
        code: this.page,
      });
      if (
        resModule.status === RESULT_STATUS.OK &&
        resPage.status === RESULT_STATUS.OK
      ) {
        this.moduleKey = resModule.data[0]?._key || '';
        this.pageKey = resPage.data[0]?._key || '';

        const resGroup = await this.renderPageService.findGroup({
          module: this.moduleKey,
          page: this.pageKey,
          type: 'view'
        });
        if (resGroup.status === RESULT_STATUS.OK) {
          this.groupKey = resGroup.data[0]?._key || '';
          this.collection = resGroup.data[0]?.collection || '';

          console.log(this.moduleKey);
          console.log(this.pageKey);
          console.log(this.groupKey);

          const resView = await this.renderPageService.findSysView({
            module: this.moduleKey,
            page: this.pageKey,
            group: this.groupKey,
          });

          if (
            resView.status === RESULT_STATUS.OK &&
            resView?.data?.length > 0
          ) {
            this.viewComponents = resView.data;
            this.setupForm(this.viewComponents);
            this.setupComponent(this.viewComponents);
            if (this._key) {
              this.viewForm.addControl('_key', new FormControl(null));
              this.patchDataToForm(resView.data || []);
            }
          }
        } else {
          this.navigateTo404();
        }
        this.cancelLoadingApp();
      } else {
        this.navigateTo404();
      }
    } catch {
      this.cancelLoadingApp();
    }
  }
  async patchDataToForm(data: any[]) {
    const conditions = {};
    this.cloneData = {};
    conditions['_key'] = this._key;
    data.forEach((e) => {
      if (e['search_setting']) {
        const prop = Object.entries(e['search_setting']).reduce(
          (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
          {}
        );
        conditions[e['item_id']] = prop;
      }
    });
    const res = await this.renderPageService.findDataByCollection(
      this.collection,
      conditions
    );
    if (res.data.length > 0) {
      const value = JSON.parse(res.data[0]['data'] || '[]');
      this.viewForm.patchValue(value);
      (Object.keys(this.viewForm.controls) || []).forEach((name) => {
        this.cloneData[name] = this.viewForm.controls[name].value;
      });
    } else {
      this.router.navigate([`/404`]);
    }
  }

  setupComponent(components: any[]) {
    const leftSide = [];
    const rightSide = [];
    components.forEach((component) => {
      if (component.type !== 'hidden') {
        if (component.col_no === 1) {
          leftSide.push({...component, value: this.getValue(component.item_id)});
        } else {
          rightSide.push({...component, value: this.getValue(component.item_id)});
        }
      }
    });
    this.leftSide = leftSide.sort((a, b) => a.row_no - b.row_no);
    this.rightSide = rightSide.sort((a, b) => a.row_no - b.row_no);

    console.log(this.leftSide, this.rightSide);
  }
  getValue(item_id: string) {
    switch (item_id) {
      case 'class':
        return '性別';
      case 'parernt_code':
        return '機械保全';
      case 'name':
        return '機械保全123123';
      case 'code':
        return '機械保全';
    }
    console.log(item_id)
    return 'man';
  }

  setupForm(components: any) {
    const group = {};
    components.forEach((component) => {
      if (component.item_id) {
        if (
          component.type === 'date' &&
          component?.component_setting?.from_to
        ) {
          group[component.item_id + '_from'] = new FormControl();
          group[component.item_id + '_to'] = new FormControl();
        } else {
          group[component.item_id] = new FormControl(null, Validators.required);
        }

        if (component['component_setting']?.is_multi_language) {
          this.multiLang.push(component.item_id);
        }
      }
    });
    this.viewForm = new FormGroup(group);
  }
  navigateTo404() {
    this.cancelLoadingApp();
    this.router.navigate([`/404`]);
  }
}
