import { RESULT_STATUS } from '@ait/shared';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChangeLangage, StoreSetting } from '../state/actions';
import { AppState } from '../state/selectors';
import { AitAppUtils } from '../utils/ait-utils';
import { AitEnvironmentService } from './ait-environment.service';

@Injectable({
  providedIn: 'root'
})
export class AitSettingAppService {
  company
  lang
  constructor(
    private store: Store<AppState>,
    private httpService: HttpClient,
    private envService: AitEnvironmentService,
  ) {
    // store.pipe(select(getLang)).subscribe(lang => {
    // })

  }



  async Init() {
    if (localStorage.access_token) {
      const userId = AitAppUtils.getUserId();
      // console.log('APP INITIALIZING', userId, this.envService);
      const env: any = this.envService;

      const url = env?.API_PATH.BASE_REST_PREFIX + '/user/get-setting';
      try {
        const r: any = await this.httpService.post(url,
          {
            token: localStorage.getItem('access_token'),
            user_id: userId,
            lang: localStorage.getItem('lang'),
            condition: { user_id: userId }
          }).toPromise();


        if (r?.status === RESULT_STATUS.OK) {
          const data = r.data ? r.data[0] : {};

          this.lang = data?.site_language || env.COMMON.LANG_DEFAULT
          // Push lang on store base on user-setting
          this.store.dispatch(
            new ChangeLangage(
              data?.site_language || env.COMMON.LANG_DEFAULT
            )
          );
          localStorage.setItem('lang', data?.site_language || env.COMMON.LANG_DEFAULT);

          this.store.dispatch(new StoreSetting({
            ...data,
            date_format_display: data?.date_format_display?.value,
            date_format_input: data?.date_format_input?.value,
            number_format: data?.number_format?.value
          }));


          //console.log(this.lang)

          // //get caption common for buttons, header, label, ...
          // this.getCommonCaptions(this.lang).then();

        }
      } catch (error) {
        console.log(error);
      }

    }
  }
}
