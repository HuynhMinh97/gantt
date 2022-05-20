import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitMasterDataService,
  AppState,
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'ait-master-data-list',
  templateUrl: './master-data-list.component.html',
  styleUrls: ['./master-data-list.component.scss'],
})
export class MasterDataListComponent
  extends AitBaseComponent
  implements OnInit {
  constructor(
    private masterDataService: AitMasterDataService,
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

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    //
  }

  async search() {
    try {
      const data = await this.masterDataService.getAllMasterDataAllLanguage();
      const newArr = [];
      data.data.map((e: any) =>
        newArr.push(
          Object.assign({
            class: e['class'],
            parent_code: e['parent_code'],
            code: e['code'],
            name_VN: e['name']['vi_VN'],
            name_JP: e['name']['ja_JP'],
            name_EN: e['name']['en_US'],
            create_at: e['create_at'],
            create_by: e['create_by'],
            change_at: e['change_at'],
            change_by: e['change_by'],
          })
        )
      );
      return { data: newArr };
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
