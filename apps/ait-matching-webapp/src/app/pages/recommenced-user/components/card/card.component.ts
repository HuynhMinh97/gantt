/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RESULT_STATUS } from '@ait/shared';
import {
  AitBinaryDataService,
  AitCurrencySymbolService,
  AitDateFormatService,
  AitNumberFormatPipe,
  AitTranslationService,
  AppState,
  getEmpId,
} from '@ait/ui';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ReactionService } from 'apps/ait-matching-webapp/src/app/services/reaction.service';
import { RecommencedUserService } from 'apps/ait-matching-webapp/src/app/services/recommenced-user.service';
import { COLOR } from '../../../interface';

export const color = {
  green: 'linear-gradient(90deg, #78C047 50%, #97D791 84%)',
  orange: 'linear-gradient(90deg, #F5B971 50%, #ED9D3C 84%)',
  blue: 'linear-gradient(89.75deg, #002B6E 0.23%, #2288CC 99.81%)',
};

export const fields = [
  '実習生名',
  '性別', //性別
  '生年月日', // 生年月日
  '都道府県',
  '職種', //職種,
  '在留資格', //在留資格
  '希望の給料', //希望の給料
  '希望の職種（分野）',
];

export enum FIELD {
  '実習生名' = 'name',
  '性別' = 'gender',
  '生年月日' = 'dob',
  '生年月日（和暦）' = 'dob_jp',
  'パスポート番号' = 'passport_number',
  '受入企業名' = 'accepting_company',
  '現住所' = 'address',
  '入国日' = 'immigration_date',
  '雇用開始日' = 'employment_start_date',
  '許可年月日（2号移行（予定）年月日）' = 'no2_permit_date',
  '3号試験学科' = 'no3_exam_dept_date',
  '3号試験学科合否' = 'no3_exam_dept_pass',
  '3号試験実技' = 'no3_exam_practice_date',
  '3号試験実技合否' = 'no3_exam_practice_pass',
  '許可年月日（3号移行(予定)年月日）' = 'no3_permit_date',
  '職種' = 'occupation', //update for industry,
  '実習生名（カナ）' = 'name_kana', // name on header card
  '在留資格' = 'residence_status',
  '希望の給料' = 'current_salary',
  '希望の職種（分野）' = 'business',
  '都道府県' = 'prefecture',
}

@Component({
  selector: 'ait-aureolev-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class AureoleVCardComponent implements OnInit {
  @Input() card: any;
  @Input() user_id: any;
  i18n = '';
  colorCard = COLOR.color1;
  backgroundCard = color.green;
  userId = '';
  fieldCard: any[] = fields;
  @Input() addressSearch = '';
  @Input() company_key = '';
  @Output() actionSaveEvent = new EventEmitter();
  fieldDate = ['生年月日'];
  avatarURL = 'https://ui-avatars.com/api/?name=';
  avatar = '';
  isLoadingAvatar = true;
  cardH;
  skills = [];
  originUrl = location.origin + this.binaryService.downloadUrl;
  master_data_fields = [
    'gender',
    'occupation',
    'prefecture',
    'residence_status',
    'work',
    'bussiness',
  ];
  key_avatar = '';

  imageNotFound() {
    this.isLoadingAvatar = false;
    this.avatar = this.card?.first_name
      ? this.avatarURL +
        (this.card?.last_name.replace(' ', '+') +
          this.card?.first_name.replace(' ', '+'))
      : this.avatarURL + '';
  }

  getAvatar = () => {
    const avatar =
      this.card?.avatar &&
      this.card?.avatar.length !== 0 &&
      this.card?.avatar instanceof Array
        ? this.card?.avatar[0]
        : null;
    this.avatar = this.originUrl + avatar;
  };

  getAvatarDefault = () => {
    return this.card?.first_name
      ? this.avatarURL +
          (this.card?.last_name.replace(' ', '+') +
            this.card?.first_name.replace(' ', '+'))
      : this.avatarURL + '';
  };

  getContent(data) {
    if (this.master_data_fields.includes(data?.field)) {
      if (data?.value?.value) {
        return `・${this.translateService.translate(
          this.i18n + data?.field
        )}：${data.value?.value}`;
      }
      return '';
    } else if (data?.field === 'dob') {
      if (data.value) {
        return `・${this.translateService.translate(
          this.i18n + data?.field
        )}：${this.dateFormatService.formatDate(data.value, 'display')}`;
      }
      return '';
    } else if (data?.field === 'current_salary') {
      if (data.value) {
        return `・${this.translateService.translate(
          this.i18n + data?.field
        )}：${this.getNumberValue(data.value)}`;
      }
      return '';
    } else if (data?.field === 'business') {
      if (data?.value?.value) {
        return `・${this.translateService.translate(
          this.i18n + data?.field
        )}：${data.value?.value}`;
      }
      return '';
    } else {
      return data.value
        ? `・${this.translateService.translate(this.i18n + data?.field)}：${
            data.value
          }`
        : '';
    }
  }

  getNumberValue = (data) => {
    return (
      this.numberFormatService.transform(data) +
      this.currencySymbolService.getCurrencyByLocale()
    );
  };

  constructor(
    store: Store<AppState>,
    private reactionService: ReactionService,
    private router: Router,
    private binaryService: AitBinaryDataService,
    private translateService: AitTranslationService,
    private dateFormatService: AitDateFormatService,
    private numberFormatService: AitNumberFormatPipe,
    private currencySymbolService: AitCurrencySymbolService,
    private recommencedService: RecommencedUserService
  ) {
    store.pipe(select(getEmpId)).subscribe((id) => (this.userId = id));
  }
  ngOnInit() {
    this.cardH = this.card;
    this.getAvatar();
    this.addColor();
    this.fieldCard = this.fieldCard
      .map((m) => ({ key: m, value: this.card[FIELD[m]], field: FIELD[m] }))
      .filter((v) => v.value);
  }

  getDateField = (key) => {
    return `・${key}：`;
  };

  navigateProfile = (user_id: string) => {
    this.router.navigateByUrl('/user/' + user_id);
  };

  addColor = () => {
    if (this.card?.group_no === 1) {
      this.backgroundCard = color.green;
      this.colorCard = COLOR.color1;
    } else if (this.card?.group_no === 2) {
      this.backgroundCard = color.orange;
      this.colorCard = COLOR.color2;
    } else {
      this.backgroundCard = color.blue;
      this.colorCard = COLOR.color3;
    }
  };

  // Highlight name option when user type
  highlightName = (name) => {
    const res = name.replace(
      new RegExp(this.addressSearch.trim(), 'gmi'),
      (match) => {
        return `<b class="hightlighted" style="background:yellow">${match}</b>`;
      }
    );
    return res;
  };

  getIndustry = () => {
    return this.card.company.replace('（', ',').replace('）', '').split(',')[1];
  };

  actionButtonSave = () => {
    console.log(this.user_id);
    console.log(this.card.user_id);
    this.recommencedService.saveRecommendUser(this.user_id, this.card?.user_id);
    return;
    if (!this.card.is_saved) {
      
    } else {
      this.reactionService
        .removeSaveCompanyUser([
          {
            company_id: this.company_key,
            user_key: this.card.user_id,
          },
        ])
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            this.card.is_saved = !this.card?.is_saved;
          }
          this.actionSaveEvent.emit({
            user_id: this.card.user_id,
            is_saved: this.card.is_saved,
          });
        });
    }
  };
}
