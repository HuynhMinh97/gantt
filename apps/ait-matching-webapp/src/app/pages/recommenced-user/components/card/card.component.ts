/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RESULT_STATUS } from '@ait/shared';
import { AitBinaryDataService, AppState, getEmpId } from '@ait/ui';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NbIconLibraries } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { RecommencedUserService } from 'apps/ait-matching-webapp/src/app/services/recommenced-user.service';
import _ from 'lodash';
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
  @Input() project_id: any;
  @Input() isSaveMode = false;
  @Input() isAddMode = false;
  colorCard = COLOR.color1;
  backgroundCard = color.green;
  userId = '';
  @Output() actionSaveEvent = new EventEmitter();
  @Output() actionAddEvent = new EventEmitter();
  @Output() actionCreateEvent = new EventEmitter(false);
  @Input() tabIndex: any;
  avatarURL = 'https://ui-avatars.com/api/?name=';
  avatar = '';
  isLoadingAvatar = true;
  cardH: any;
  skills = [];
  planObj = [];
  originUrl = location.origin + this.binaryService.downloadUrl;
  private monthShortNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

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

  constructor(
    store: Store<AppState>,
    private router: Router,
    private binaryService: AitBinaryDataService,
    private recommencedService: RecommencedUserService,
    private iconLibraries: NbIconLibraries
  ) {
    store.pipe(select(getEmpId)).subscribe((id) => (this.userId = id));
    this.iconLibraries.registerFontPack('font-awesome', {
      packClass: 'far',
      iconClassPrefix: 'fa',
    });
    this.iconLibraries.registerFontPack('font-awesome-fas', {
      packClass: 'fas',
      iconClassPrefix: 'fa',
    });
  }

  ngOnInit() {
    try {
      this.cardH = { ...this.card };
      this.cardH.skills = _.uniqBy(
        this.cardH.skills
          .slice()
          .sort(
            (a: { level: number }, b: { level: number }) => b.level - a.level
          ),
        '_key'
      );
      this.getAvatar();
      this.addColor();
      this.setupPlan();
    } catch (e) {
      console.log(e);
    }
  }
  async setupPlan() {
    const planObj = [];
    const thisMonth = new Date().getMonth() + 1;
    [...Array(3)].forEach((e, i) => {
      planObj.push({
        _key: thisMonth + i + 1,
        value:
          thisMonth + i > 11
            ? this.monthShortNames[thisMonth - 12 + i]
            : this.monthShortNames[thisMonth + i],
        mm: 0,
      });
    });
    const res = await this.recommencedService.findPlan(this.cardH.user_id);
    if (res.status === RESULT_STATUS.OK) {
      const data = res.data;
      if (data.length === 3) {
        this.planObj = data;
      } else {
        this.planObj = planObj;
      }
    } else {
      this.planObj = planObj;
    }
  }

  sumMM() {
    if (this.planObj.length === 0) {
      return 0;
    } else {
      return +this.planObj.reduce((a, b) => a + b.mm, 0).toFixed(2);
    }
  }

  getMM(index: number) {
    if (this.planObj.length === 0) return 0;
    return +this.planObj[index]['mm'].toFixed(2);
  }

  getValue(index: number) {
    if (this.planObj.length === 0) return '';
    return this.planObj[index]['value'];
  }

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

  actionButtonPlan = (_key: string) => {
    //
  };

  actionButtonAdd = (_key: string) => {
    this.cardH.is_team_member = !this.cardH?.is_team_member;
    if (!this.project_id) {
      this.actionCreateEvent.emit(this.cardH);
      return;
    }
    if (!this.cardH.is_team_member) {
      const _from = `biz_project/${this.project_id}`;
      const _to = `sys_user/${_key}`;
      this.recommencedService.removeTeamMember(_from, _to).then((r) => {
        if (r.status === RESULT_STATUS.OK) {
          this.actionAddEvent.emit({
            user_id: this.card.user_id,
            is_team_member: this.card.is_team_member,
          });
        }
      });
    } else {
      this.recommencedService
        .saveTeamMember(this.project_id, this.cardH?.user_id)
        .then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            this.actionAddEvent.emit({
              user_id: this.card.user_id,
              is_team_member: this.card.is_team_member,
            });
          }
        });
    }
  };
}
