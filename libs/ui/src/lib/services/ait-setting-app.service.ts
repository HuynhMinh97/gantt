/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { RESULT_STATUS } from '@ait/shared';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChangeLangage, StoreSetting } from '../state/actions';
import { AppState } from '../state/selectors';
import { AitAppUtils } from '../utils/ait-utils';
import { AitEnvironmentService } from './ait-environment.service';
import { AitUserService } from './common/ait-user.service';

@Injectable({
  providedIn: 'root',
})
export class AitSettingAppService {
  company: string;
  lang: string;
  constructor(
    private envService: AitEnvironmentService,
    private userService: AitUserService,
    private store: Store<AppState>
  ) {}

  async Init() {
    if (localStorage.access_token) {
      const userId = AitAppUtils.getUserId();
      const env: any = this.envService;
      try {
        const r: any = await this.userService.getUserSetting(userId);

        if (r?.status === RESULT_STATUS.OK) {
          const data = r.data ? r.data[0] : {};

          this.lang = data?.site_language || env.COMMON.LANG_DEFAULT;
          // Push lang on store base on user-setting
          this.store.dispatch(
            new ChangeLangage(data?.site_language || env.COMMON.LANG_DEFAULT)
          );
          localStorage.setItem(
            'lang',
            data?.site_language || env.COMMON.LANG_DEFAULT
          );

          this.store.dispatch(
            new StoreSetting({
              ...data,
              date_format_display: data?.date_format_display?.value,
              date_format_input: data?.date_format_input?.value,
              number_format: data?.number_format?.value,
            })
          );
        }
      } catch (error) {
      }
    }
  }
}
