/* eslint-disable @nrwl/nx/enforce-module-boundaries */
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
import { AuthHelper } from 'libs/core/src/lib/utils/ait-auth.helper';


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

  async registerForAdmin( username: string, email: string, password: string, company: string, _key?: string) {
    let query
    if (_key) {
      query = this.apollo
      .mutate({
        mutation: gql`
            mutation {
              register(input: {_key: "${_key}", username: "${username}", email: "${email}", password: "${password}",company : "${
          company || this.company
        }", del_flag: false, active_flag: true, type: 3 }) {
                token
                refreshToken
                timeLog
              }
            }
          `,
      })
      .pipe(map((res) => (<any>res.data)['register']))
      .toPromise();
    } else {
      query = this.apollo
      .mutate({
        mutation: gql`
            mutation {
              register(input: { username: "${username}", email: "${email}", password: "${password}",company : "${
          company || this.company
        }", del_flag: false, active_flag: true, type: 3 }) {
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
    return query;
  }

  // async editAccount(username: string, email: string, _key: string, old_password: string,new_password: string ) { 
  //   return this.apollo
  //     .mutate({
  //       mutation: gql`
  //       mutation {
  //         changePassword(input : {
  //           company: "${this.company}",
  //           lang: "${this.currentLang}",
  //           collection: "",
  //           user_id: "${this.user_id}",
  //           data: [
  //             {
  //               email: "${email}"
  //               username: "${username}",
  //               user_id: "${_key}",
  //               old_password: "${old_password}",
  //               new_password: "${new_password}"
  //             }
  //           ]
  //         }){
  //           data  {
  //             _key
  //             email
  //             username
  //           }
  //           message
  //           error_code
  //           status
  //         }
  //       }
  //       `,
  //     })
  //     .pipe(map((res) => (<any>res.data)['changePassword']))
  //     .toPromise();
  // }


  
}
