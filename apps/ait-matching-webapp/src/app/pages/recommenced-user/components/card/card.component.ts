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

@Component({
  selector: 'ait-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class AitCardComponent implements OnInit {
  @Input() card: any;
  @Input() user_id: any;
  i18n = '';
  colorCard = COLOR.color1;
  backgroundCard = color.green;
  userId = '';
  @Input() addressSearch = '';
  @Input() company_key = '';
  @Output() actionSaveEvent = new EventEmitter();
  @Input() tabIndex;
  @Input() isJob = false;
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
    this.avatar = this.cardH?.first_name
      ? this.avatarURL +
        (this.cardH?.last_name.replace(' ', '+') +
          this.cardH?.first_name.replace(' ', '+'))
      : this.avatarURL + '';
  }

  getAvatar = () => {
    const avatar =
      this.cardH?.avatar &&
      this.cardH?.avatar.length !== 0 &&
      this.cardH?.avatar instanceof Array
        ? this.cardH?.avatar[0]
        : null;
    this.avatar = this.originUrl + avatar;
  };

  getAvatarDefault = () => {
    return this.cardH?.first_name
      ? this.avatarURL +
          (this.cardH?.last_name.replace(' ', '+') +
            this.cardH?.first_name.replace(' ', '+'))
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
    try {
      this.cardH = { ...this.card, is_team_member: false };
      this.cardH.skills = this.cardH.skills
        .slice()
        .sort((a, b) => b.level - a.level);
      this.getAvatar();
      this.addColor();
      console.log(this.cardH);
    } catch (e) {
      console.log(e);
    }
  }

  getDateField = (key) => {
    return `・${key}：`;
  };

  navigateProfile = (user_id: string) => {
    this.router.navigateByUrl('/user/' + user_id);
  };

  addColor = () => {
    if (this.cardH?.group_no === 1) {
      this.backgroundCard = color.orange;
      this.colorCard = COLOR.color2;
    } else if (this.cardH?.group_no === 2) {
      this.backgroundCard = color.green;
      this.colorCard = COLOR.color1;
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
    return this.cardH.company
      .replace('（', ',')
      .replace('）', '')
      .split(',')[1];
  };

  routerToProfile() {
    this.router.navigate([`/user-profile/${this.cardH.user_id}`]);
  }

  actionButtonSave = (_key: string) => {
    this.cardH.is_saved = !this.cardH?.is_saved;
    if (!this.cardH.is_saved) {
      const _from = `sys_user/${this.user_id}`;
      const _to = `sys_user/${_key}`;
      this.recommencedService.removeSaveRecommendUser(_from, _to).then((r) => {
        if (r.status === RESULT_STATUS.OK) {
          this.actionSaveEvent.emit({
            user_id: this.card.user_id,
            is_saved: this.card.is_saved,
          });
        }
      });
    } else {
      this.recommencedService
        .saveRecommendUser(this.user_id, this.cardH?.user_id)
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            this.actionSaveEvent.emit({
              user_id: this.card.user_id,
              is_saved: this.card.is_saved,
            });
          }
        });
    }
  };

  actionButtonAdd = (key: string) => {
    this.cardH.is_team_member = !this.cardH?.is_team_member;
  };
}
