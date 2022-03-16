import { AitAuthService, AitBaseComponent, AitEnvironmentService, AppState } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'ait-user-language-detail',
  templateUrl: './user-language-detail.component.html',
  styleUrls: ['./user-language-detail.component.scss']
})
export class UserLanguageDetailComponent extends AitBaseComponent implements OnInit {
  _key:string;
  constructor(
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

    this.setModulePage({
      module: 'user',
      page: 'user_language',
    });

   }

  ngOnInit(): void {
    this._key = this.activeRouter.snapshot.paramMap.get('id');
    this.callLoadingApp();
  }

}

