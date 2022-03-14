import { AitAuthService, AitBaseComponent, AitEnvironmentService, AppState } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'ait-certificate-detail',
  templateUrl: './certificate-detail.component.html',
  styleUrls: ['./certificate-detail.component.scss']
})
export class CertificateDetailComponent extends AitBaseComponent implements OnInit {
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
   }

  ngOnInit(): void {
    this._key = this.activeRouter.snapshot.paramMap.get('id');
    this.callLoadingApp();
  }

}
