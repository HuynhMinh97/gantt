import { RESULT_STATUS } from '@ait/shared';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Sanitizer, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AitBinaryDataService, AitCurrencySymbolService, AitDateFormatService, AitTranslationService, AppState, getEmpId } from '@ait/ui';
import { COLOR, FIELD, fields } from '../../../interface';
import { ReactionService } from 'apps/ait-matching-webapp/src/app/services/reaction.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AitNumberFormatPipe } from 'libs/ui/src/lib/@theme/pipes/ait-number-format.pipe';

export const color = {
  green: 'linear-gradient(90deg, #78C047 50%, #97D791 84%)',
  orange: 'linear-gradient(90deg, #F5B971 50%, #ED9D3C 84%)',
  blue: 'linear-gradient(89.75deg, #002B6E 0.23%, #2288CC 99.81%)'
};



@Component({
  selector: 'ait-aureolev-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class AureoleVCardComponent implements OnInit, OnChanges {

  @Input() card;
  i18n = 'common.aureole-v.recommenced-user.list-info.'
  colorCard = COLOR.color1;
  backgroundCard = color.green;
  userId = '';
  fieldCard: any[] = fields;
  @Input() addressSearch = '';
  @Input() company_key = '';
  @Output() actionSaveEvent = new EventEmitter();
  fieldDate = ['生年月日'];
  avatarURL = 'https://ui-avatars.com/api/?name=';
  avatar = ''
  isLoadingAvatar = true;
  cardH;
  originUrl = location.origin + this.binaryService.downloadUrl;
  master_data_fields = ['gender', 'occupation', 'prefecture', 'residence_status', 'work'];
  key_avatar = ''

  // testImage(URL) {
  //   // console.log(this.avatar, this.card.name)
  //   const tester = new Image();
  //   tester.onerror = this.imageNotFound;
  //   tester.src = URL;
  // }

  imageNotFound(e) {
    // // console.log('no image ' + this.card.name, e)
    this.isLoadingAvatar = false;
    this.avatar = this.card?.name ? this.avatarURL + this.card?.name.replace(' ', '+') : this.avatarURL + '';
    // // console.log(this.avatar, this.card.name)
  }

  getAvatar = () => {
    const avatar = this.card?.avatar
      && this.card?.avatar.length !== 0
      && this.card?.avatar instanceof Array
      ? this.card?.avatar[0]
      : null;
    this.avatar = this.originUrl + avatar;
  }

  getAvatarDefault = () => {
    return this.card?.name ? this.avatarURL + this.card?.name.replace(' ', '+') : this.avatarURL + '';
  }


  getContent(data) {
    if (this.master_data_fields.includes(data?.field)) {
      if(data?.value?.value) {
        return `・${this.translateService.translate(this.i18n + data?.field)}：${data.value?.value}`
      }
      return '';
    }
    else if (data?.field === 'dob') {
      if(data.value) {
        return `・${this.translateService.translate(this.i18n + data?.field)}：${this.dateFormatService.formatDate(data.value, 'display')}`
      }
      return '';
    }
    else if (data?.field === 'current_salary') {
      if(data.value) {
        return `・${this.translateService.translate(this.i18n + data?.field)}：${this.getNumberValue(data.value)}`
      }
      return ''
    }
    else {
      return data.value ? `・${this.translateService.translate(this.i18n + data?.field)}：${data.value}` : ''
    }
  }

  getNumberValue = (data) => {
    return this.numberFormatService.transform(data) + this.currencySymbolService.getCurrencyByLocale();
  }

  constructor(
    store: Store<AppState>,
    private reactionService: ReactionService,
    private router: Router,
    private binaryService: AitBinaryDataService,
    private santilizer: DomSanitizer,
    private translateService: AitTranslationService,
    private dateFormatService: AitDateFormatService,
    private numberFormatService: AitNumberFormatPipe,
    private currencySymbolService: AitCurrencySymbolService
  ) {
    store.pipe(select(getEmpId)).subscribe(id => this.userId = id);
  }
  ngOnInit() {
    // // console.log(this.card);
    // // console.log(this.translateService.translate('common.aureole-v.recommenced-user'))
    this.cardH = this.card;
    this.getAvatar();
    this.addColor();
    this.fieldCard = this.fieldCard.map(m =>
      ({ key: m, value: this.card[FIELD[m]], field: FIELD[m] })).filter(v => v.value);
    // // console.log(this.fieldCard);
  }


  // getContent = (key: string, value: string) => {
  //   return `・${key}：${value}`
  // }

  getDateField = (key) => {
    return `・${key}：`
  }
  ngOnChanges(object: SimpleChanges) {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const element = object[key].currentValue;
        if (key === 'addressSearch') {
          // // // console.log(element);
          // // // console.log(this.highlightName(element))
        }
      }
    }
  }

  navigateProfile = (user_id: string) => {
    this.router.navigateByUrl('/user/' + user_id);
  }

  addColor = () => {
    // if (!this.card?.total_score) {
    //   this.backgroundCard = color.blue;
    //   return this.colorCard = COLOR.color3;
    // }
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

  }

  // Highlight name option when user type
  highlightName = (name) => {
    // // // console.log(this.addressSearch);
    const res = name.replace(new RegExp(this.addressSearch.trim(), 'gmi'), (match) => {
      return `<b class="hightlighted" style="background:yellow">${match}</b>`;
    });
    // // // console.log(res)
    return res;

  }

  getIndustry = () => {
    return this.card.company.replace('（', ',').replace('）', '').split(',')[1];
  }


  actionButtonSave = (user_key: string) => {
    if (!this.card.is_saved) {
      this.reactionService.saveCompanyUser([{
        company_id: this.company_key,
        user_key: this.card.user_id,
      }]).then(r => {
        if (r.status === RESULT_STATUS.OK) {
          this.card.is_saved = !this.card?.is_saved;
          this.actionSaveEvent.emit({
            user_id: this.card.user_id,
            is_saved: this.card.is_saved,
          });
        }
      });
    } else {
      this.reactionService.removeSaveCompanyUser([{
        company_id: this.company_key,
        user_key: this.card.user_id,
      }]).then(r => {
        if (r.status === RESULT_STATUS.OK) {
          this.card.is_saved = !this.card?.is_saved;
        }
        this.actionSaveEvent.emit({
          user_id: this.card.user_id,
          is_saved: this.card.is_saved,
        });
      });
    }


  }
}
