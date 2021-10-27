import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { Action, select, Store } from '@ngrx/store';
import { AitTranslationService } from '../../services/common/ait-translate.service';
import { UserInfo } from '../models';
import { AppState, getCaption } from '../selectors';
import { ActionTypes } from '../types';

export class LOGIN implements Action {
  readonly type = ActionTypes.Login;
  public payload: any;
  // tslint:disable-next-line: variable-name
  constructor(_payload: any) {
    this.payload = _payload;
  }
}

export class GET_ENV implements Action {
  readonly type = ActionTypes.get_environment;
  public payload: any;
  // tslint:disable-next-line: variable-name
  constructor(_payload: any) {
    this.payload = _payload;
  }
}
export class LOADINGAPP implements Action {
  readonly type = ActionTypes.Loading_app;
  public payload: any;
  // tslint:disable-next-line: variable-name
  constructor(_payload: any) {
    this.payload = _payload;
  }
}

export class CHANGECOMPANY implements Action {
  readonly type = ActionTypes.Change_company_app;
  public payload: any;
  // tslint:disable-next-line: variable-name
  constructor(_payload: any) {
    this.payload = _payload;
  }
}

export class SHOWSNACKBAR implements Action {
  readonly type = ActionTypes.Show_snackbar;
  public payload: any;
  err
  // tslint:disable-next-line: variable-name
  constructor(_payload: any, snackbar: NbToastrService, store: Store<AppState>) {
    if (_payload?.type === 'warning') {
      snackbar.warning(_payload?.message, _payload?.title, {
        duration: 3000,
        position: NbGlobalPhysicalPosition.BOTTOM_RIGHT
      });
    }
    else {
      const trService = new AitTranslationService(store);
      store.pipe(select(getCaption)).subscribe(() => {
        this.err = trService.getMsg('E0100');
        // console.log(this.err)
        if (this.err && this.err !== 'E0100') {
          this.payload = _payload;
          snackbar.danger('Error', this.err, {
            duration: 3000,
            position: NbGlobalPhysicalPosition.BOTTOM_RIGHT
          });
        }
      })
    }

  }
}


export class StoreUserId implements Action {
  readonly type = ActionTypes.Store_user_id;
  public payload: any;
  // tslint:disable-next-line: variable-name
  constructor(_payload: any) {
    this.payload = _payload;
  }
}

export class StoreUserInfo implements Action {
  readonly type = ActionTypes.Store_user_info;
  public payload: UserInfo;
  constructor(_payload: UserInfo) {
    this.payload = _payload;
  }
}

export class StoreUserProfile implements Action {
  readonly type = ActionTypes.Store_user_profile;
  public payload: any;
  constructor(_payload: any) {
    this.payload = _payload;
  }
}

export class StoreSetting implements Action {
  readonly type = ActionTypes.Store_user_setting;
  public payload: any;
  constructor(_payload: any) {
    this.payload = _payload;
  }
}

export class GetCaptionByPages implements Action {
  readonly type = ActionTypes.get_caption_by_pages;
  public payload: any;
  constructor(_payload: any) {
    this.payload = _payload;
  }
}

export class GetCommonMessages implements Action {
  readonly type = ActionTypes.get_common_message;
  public payload: any;
  constructor(_payload: any) {
    this.payload = _payload;
  }
}

export class GetCommonCaptions implements Action {
  readonly type = ActionTypes.get_common_caption;
  public payload: any;
  constructor(_payload: any) {
    this.payload = _payload;
  }
}

export class GetPageInfo implements Action {
  readonly type = ActionTypes.get_page_info;
  public payload: any;
  constructor(_payload: any) {
    this.payload = _payload;
  }
}


export class ChangeLangage implements Action {
  readonly type = ActionTypes.Change_lang_app;
  public payload: string;
  constructor(_payload: any) {
    this.payload = _payload;
    localStorage.setItem('lang', this.payload)
  }
}


export class RemmemberMe implements Action {
  readonly type = ActionTypes.remmember_me;
  public payload: any;
  constructor(_payload: any) {
    this.payload = _payload;
  }
}

export class GetCurrencySymbol implements Action {
  readonly type = ActionTypes.Get_currency_symbol;
  public payload: any;
  constructor(_payload: any) {
    this.payload = _payload;
  }
}


export class SetModulePage implements Action {
  readonly type = ActionTypes.Set_module_page;
  public payload: { page: string, module: string };
  constructor(_payload: { page: string, module: string }) {
    this.payload = _payload;
  }
}
