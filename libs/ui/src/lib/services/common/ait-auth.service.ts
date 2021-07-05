import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { select, Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StoreUserInfo } from '../../state/actions';
import { AppState, getEmail } from '../../state/selectors';
import { NbToastrService } from '@nebular/theme';
import { AitEncrDecrService } from './ait-encrypt.service';
import { AitBaseService } from './ait-base.service';
import { AitUserService } from './ait-user.service';
import { AitEnvironmentService } from '../ait-environment.service';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class AitAuthService extends AitBaseService {
  private loginURL = '/auth/login';
  private signupURL = '/auth/register';
  private changePwdURL = '/auth/change-password';
  private ACCESS_TOKEN = 'access_token';
  private REFRESH_TOKEN = 'refresh_token';
  private encodePwdURL = '/auth/encode-password';

  private checkPwdURL = '/auth/check-password';
  private storeManagement: Store<AppState>;
  constructor(
    store: Store<AppState>,
    httpService: HttpClient,
    private userService: AitUserService,
    snackbar: NbToastrService,
    private encryptService: AitEncrDecrService,
    envService: AitEnvironmentService,
    apollo: Apollo,
    private router: Router) {
    super(envService, store, httpService, snackbar, apollo);
    this.storeManagement = store;
  }

  isLogined = () => !!localStorage.getItem(this.ACCESS_TOKEN);

  decodeJWT = (token) => jwt_decode(token);

  getAccessToken = () => localStorage.getItem(this.ACCESS_TOKEN);

  checkPwd = async (password) => {
    return await this.apollo.query(
      {
        query: gql`
        query {
          checkPassword(request : {
           user_id :"${this.user_id}",
            condition : {
              password : "${password}"
            }
          }){
            isMatched
          }
        }
        `
      }
    ).toPromise();
  }


  getUserID = () => {
    try {
      const acc_token = localStorage.getItem(this.ACCESS_TOKEN);
      if (acc_token) {
        const decode = jwt_decode(acc_token);
        return decode['user_key'];
      }
      return '';
    } catch (e) {
      return '';
    }
  }

  /**
   *
   * @param email
   * @param password
   * @returns
   */
  changePassword(old_password: string, new_password: string) {
    return this.apollo
      .mutate({
        mutation: gql`
        mutation {
          changePassword(input : {
            company: "${this.company}",
            lang: "${this.currentLang}",
            collection: "",
            user_id: "${this.user_id}",
            data: [
              {
                user_id: "${this.user_id}",
                old_password: "${old_password}",
                new_password: "${new_password}"
              }
            ]
          }){
            data  {
              _key
              email
              username
            }
            message
            error_code
            status
          }
        }
        `,
      })
      .pipe(map((res) => (<any>res.data)['changePassword']))
      .toPromise();
  }

  hashedPwd = async (password: string) => {
    return await this.post(this.encodePwdURL, { password }).toPromise();
  }

  /**
 *
 * @param email
 * @param password
 * @returns
 */
  async login(email: string, password: string) {
    return await this.apollo
      .mutate({
        mutation: gql`
            mutation {
              login(input: { email: "${email}", password: "${password}" }) {
                token
                refreshToken
                timeLog
              }
            }
          `,
      })
      .toPromise();
  }

  /**
   *
   * @param email
   * @param password
   * @returns
   */
  register(email: string, password: string, company: string) {
    return this.apollo
      .mutate({
        mutation: gql`
            mutation {
              register(input: { email: "${email}", password: "${password}",company : "${company || this.company}" }) {
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

  generateTokens = async () => {
    const res: any = await this.http.post(this.baseURL + this.env?.API_PATH?.SYS?.AUTH_API_PATH + '/generate-token', {
      user_id: this.user_id
    }).toPromise();
    this.saveTokens(res?.refreshToken, res?.token)
  }

  saveTokens = (aToken, rToken) => {
    localStorage.setItem(this.ACCESS_TOKEN, aToken);
    localStorage.setItem(this.REFRESH_TOKEN, rToken);
  }

  changePwd = async (data: { old_password: string, new_password: string }) => {
    return await this.post(this.changePwdURL, {
      condition: { old_password: data.old_password, new_password: data.new_password },
    }).toPromise();
  }
  randomText = (text: string = '') => {

    let result = '';
    for (let index = 0; index < text.length; index++) {
      const bcn = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
      const element = text[index];
      result += '_' + bcn + element;
    }
    return result;
  }

  private hashPwd = async (pwd: string): Promise<any> => {
    return this.encryptService.set(pwd);
  };

  loginRest = async (user: { email: string, password: string, isRememberMe?: boolean }) => {
    const hashedPwd = await this.hashPwd(user.password)

    if (hashedPwd) {
      const userLogin = await this.post(
        this.loginURL, { email: user?.email, hashedpassword: hashedPwd }).toPromise();

      if (userLogin?.status !== 406
        && userLogin?.status !== 404
        // eslint-disable-next-line no-prototype-builtins
        && Object.keys(userLogin || {}).length !== 0 && (userLogin || {}).hasOwnProperty('timeLog')) {
        const { accessToken, refreshToken } = userLogin;
        if (user?.isRememberMe) {

        }
        this.saveTokens(accessToken, refreshToken);
        const userInfo = this.decodeJWT(accessToken);
        const userResponse = await this.userService.getAitUserInfo(userInfo['user_key']);
        this.storeManagement.dispatch(new StoreUserInfo(userResponse));
        return userLogin;
      }
      return userLogin;
    }
    else {
      return null;
    }

  }

  registerRest = async (user: { email: string, password: string }) => {
    try {
      const userRegister = await this.post(this.signupURL, { ...user }).toPromise();
      return userRegister;
    } catch (e) {
      return e;
    }
  }


  removeTokens = () => {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  logout = () => {
    this.removeTokens();
    this.router.navigateByUrl('/');
  }

}

