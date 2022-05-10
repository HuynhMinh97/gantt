// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AitEnvironmentService } from './../../../../../libs/ui/src/lib/services/ait-environment.service';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { AitEncrDecrService } from './../../../../../libs/ui/src/lib/services/common/ait-encrypt.service';
import { AitBaseService, AitUserService, AppState } from '@ait/ui';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class CreateUserService extends AitBaseService {
  private storeManagement: Store<AppState>;

  constructor(
    store: Store<AppState>,
    httpService: HttpClient,
    private userService: AitUserService,
    snackbar: NbToastrService,
    private encryptService: AitEncrDecrService,
    envService: AitEnvironmentService,
    apollo: Apollo,
    private router: Router
  ) {
    super(envService, store, httpService, snackbar, apollo);
    this.storeManagement = store;
  }
  async save(data: any[]) {
    const returnField = { _key: true };
    return await this.mutation(
      'saveUserLanguageInfo',
      'sys_user',
      data,
      returnField
    );
  }

  registerForAdmin(username: string, email: string, password: string, company: string) {
    return this.apollo
      .mutate({
        mutation: gql`
            mutation {
              register(input: {username: "${username}", email: "${email}", password: "${password}",company : "${
          company || this.company
        }", delete_flag: false, active_flag: true, type: "03" }) {
                token
                refreshToken
                timeLog
              }
            }
          `,
      })
      .pipe(map((res) => (<any>res.data)['register']))
      .toPromise();
  }
}
