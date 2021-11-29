/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable quote-props */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState, getAllInfoRequest } from '../../state/selectors';
import { Observable, of, Subscription } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { SHOWSNACKBAR } from '../../state/actions';
import { NbToastrService } from '@nebular/theme';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { COLLECTIONS, MessageModel, SYSTEM_COMPANY } from '@ait/shared';
import { AitEnvironmentService } from '../ait-environment.service';
import { AitAppUtils } from '../../utils/ait-utils';
import { Apollo, gql } from 'apollo-angular';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
@Injectable(
  {
    providedIn: 'root',
  },
)
export class AitBaseService implements OnDestroy {
  errors: MessageModel[] = [];
  masterData: any[];
  currentLang = '';
  company = '';
  token = '';
  user_id = '';
  page = '';
  module = '';
  token_valid;
  env: any = {}
  private subcription = new Subscription();
  baseURL = this.env?.API_PATH?.BASE_REST_PREFIX;
  constructor(
    _env: AitEnvironmentService,
    private store?: Store<AppState>,
    public http?: HttpClient,
    private snackbar?: NbToastrService,
    public apollo?: Apollo,
  ) {
    this.env = _env;
    this.baseURL = this.env?.API_PATH?.BASE_REST_PREFIX
    // AitAppUtils.checkTokens();
    this.token = localStorage.getItem('access_token');
    store.pipe(select(getAllInfoRequest)).subscribe(res => {
      const { lang, company, user_id, page, module } = res;
      this.user_id = AitAppUtils.getUserId() || user_id;
      this.currentLang = lang;
      this.company = company;
      this.page = page;
      this.module = module;

      //  console.log(this.company)
    });
  }

  ngOnDestroy() {
    if (this.token_valid !== null || this.token_valid !== undefined) {
      this.subcription.unsubscribe();
    }
  }

  refreshToken = async () => {
    const rf = localStorage.getItem('refresh_token');
    return  await this.apollo.mutate({
      mutation: gql`
      mutation {
        refreshToken(input : {
          refresh_token : "${rf}"
        }) {
          timeLog
          refreshToken
          token
        }
      }
      `
    }).toPromise();
  }


  saveTokens = (refToken: string, accToken: string) => {
    localStorage.setItem('access_token', refToken);
    localStorage.setItem('refresh_token', accToken);
  }

  /**
   *
   * Using method POST
   * @param {string} url :  SERVER URL which is used to request to backend/server
   * @param {Object} data : Data request which send to server
   * @returns {Observable<any>}
   * @memberof RestApiService
   */
  // tslint:disable-next-line: ban-types
  post(apiSufix: string, data: any, url?: string): Observable<any> {


    const { type, ...rest } = data;
    return this.http.post<any>(url || this.baseURL + apiSufix, {
      // Chỗ này là bao gồm condition và data, tùy vào yêu cầu của api để sử dụng
      company: this.company,
      lang: this.currentLang,
      token: this.token,
      user_id: AitAppUtils.getUserId(),
      page: this.page,
      module: this.module,
      ...rest,
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '1800',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET',
        'Access-Control-Allow-Headers': '*',
        'Authorization': 'Bearer ' + this.token,
      }),
      params: {
        type: type || 1,
      },
    }).pipe(
      // tslint:disable-next-line: no-shadowed-variable
      tap((data: any) => {
        return data;
      }),
      catchError(this.handleError<any>({ Method: 'Post', url: `${this.baseURL}`, data, response: null })),
    );


  }

  generateToken = async () => this.http.post(this.baseURL + this.env?.API_PATH?.SYS?.AUTH_API_PATH + '/generate-token', {
    user_id: this.user_id
  }).toPromise();

  checkToken = async () => this.http.post(this.baseURL + this.env?.API_PATH?.SYS?.AUTH_API_PATH + '/validate-token', {
    refresh_token: localStorage.getItem('refresh_token')
  }).toPromise();

  // checkToken2 = async () => {
  //   const name = GRAPHQL.VALIDATE_TOKEN;
  //   const returnField = {
  //     timeLog: true,
  //     token_valid: true
  //   }
  //   const result = await this.mutation(name, returnField, []);
  //   // console.log(result);
  //   return result?.data?.validateToken;
  // }

  get(apiSufix: string): Observable<any> {
    return this.http.post<any>(this.baseURL + apiSufix, {
      // Chỗ này là bao gồm condition và data, tùy vào yêu cầu của api để sử dụng
      company: this.company,
      lang: this.currentLang,
      token: this.token,
      user_id: this.user_id || AitAppUtils.getUserId(),
      page: this.page,
      module: this.module,
    }
    ).pipe(
      // tslint:disable-next-line: no-shadowed-variable
      tap((data: any) => {
        return data;
      }),
      catchError(this.handleError<any>({ Method: 'GET', url: `${this.baseURL}`, response: null })),
    );

  }

  /**
*
*
* @private
* @template T
* @param {string} [operation='operation']
* @param {T} [result]
* @returns
* @memberof RestApiService
*/
  private handleError<T>(operation: any, result?: T) {
    return (error): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead

      const errorMessage = {
        operation,
        error: error.message,
        errorDetail: error,
      };
      //an error occurred while processing your request

      if (errorMessage.errorDetail.status >= 500) {
        this.store.dispatch(new SHOWSNACKBAR('', this.snackbar, this.store))
      }

      // TODO: better job of transforming error for user consumption
      // // console.log(errorMessage);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /**
   * Fetch data from database
   * @param name name of query in graphql
   * @param returnField object return to client
   * @param condition condition search
   * @returns data or error
   */
  query(name: string, request: any, returnField?: any, includeNotDelete : boolean = true, includeNotActive: boolean = false): Promise<any> {
    // Request to graphql query
    const MASTER_COLLECTION = [COLLECTIONS.MASTER_DATA, COLLECTIONS.CAPTION, COLLECTIONS.MESSAGE];
    request['company'] = this.company || localStorage.comp || SYSTEM_COMPANY;
    request['lang'] = localStorage.lang || this.currentLang;
    request['user_id'] = this.user_id;
    const collection = request['collection'];

    // Setup gql json
    const query = {
      query: {
        [name]: {
          data: returnField,
          message: true,
          errors: true,
          status: true,
          numData: true,
          numError: true
        }
      }
    };

    request['condition'] = request['condition'] ?? {};
    request['options'] = request['options'] ?? {};
    (!!this.env.isMatching) && (includeNotDelete) && (request['condition']['del_flag'] = false);
    (!!this.env.isMatching) && (includeNotActive || MASTER_COLLECTION.includes(collection)) && (request['condition']['active_flag'] = true);
    query.query[name]['__args'] = { request };
    // Parse to gql
    const gqlQuery = jsonToGraphQLQuery(query, { pretty: true });
    // console.log(gqlQuery);

    const result = this.apollo
      .query({
        query: gql`
      ${gqlQuery}
      `,
        fetchPolicy: 'network-only',
      })
      .pipe(map((res) => (<any>res.data)[name]))
      .toPromise();
    return result;
  }

  /**
   * Insert/update/delete data
   * @param name name of query in graphql
   * @param returnField object return to client
   * @param condition condition search
   * @returns data modified or error
   */
  mutation(name: string, collection: string, data: any[], returnField: any) {
    // Request to graphql query
    const request = {
      company: this.company || SYSTEM_COMPANY,
      lang: this.currentLang,
      user_id: this.user_id,
      collection,
      //data to modify
      data,
    };
    // Setup gql json
    const query = {
      mutation: {
        [name]: {
          data: returnField,
          message: true,
          errors: true,
          status: true,
          numData: true,
          numError: true
        }
      }
    };

    query.mutation[name]['__args'] = { request };
    // Parse to gql
    const gqlQuery = jsonToGraphQLQuery(query, { pretty: true });
    console.log(gqlQuery)
    return this.apollo
      .mutate({
        mutation: gql`
          ${gqlQuery}
        `,
      })
      .pipe(map((res) => (<any>res.data)[name]))
      .toPromise();
  }
}
