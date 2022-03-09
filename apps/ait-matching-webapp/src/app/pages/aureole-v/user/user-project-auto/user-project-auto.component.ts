import { AitAuthService, AitBaseComponent, AitEnvironmentService, AppState } from '@ait/ui';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'ait-user-project-auto',
  templateUrl: './user-project-auto.component.html',
  styleUrls: ['./user-project-auto.component.scss']
})
export class UserProjectAutoComponent extends AitBaseComponent implements OnInit {
  key = '';
  constructor(
    public activeRouter: ActivatedRoute,
    env: AitEnvironmentService,
    store: Store<AppState>,
    apollo: Apollo,
    authService: AitAuthService,
    toastrService: NbToastrService,
    layoutScrollService: NbLayoutScrollService,
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

    this.key= this.activeRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    
  }

}
