/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { isArrayFull } from '@ait/shared';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  NbDialogService,
  NbIconLibraries,
  NbToastrService,
} from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import {
  AitAuthService,
  AitEnvironmentService,
  AitTranslationService,
  AitUserService,
} from '../../services';
import { AitLayoutService } from '../../services/common/ait-layout.service';
import {
  AppState,
  getCaption,
  getEmail,
  getLang,
  getUFullName,
  getUserInfo,
} from '../../state/selectors';
import { AitBaseComponent } from '../base.component';

@Component({
  selector: 'ait-menu-user',
  styleUrls: ['./ait-menu-user.component.scss'],
  templateUrl: './ait-menu-user.component.html',
})
export class AitMenuUserComponent extends AitBaseComponent implements OnInit {
  isOpenMenu = false;
  userProfile: any;
  data: any[];
  menus = [];
  fullName = '';
  avatarURL = 'https://ui-avatars.com/api/?name=';
  currentLang = 'ja_JP';
  userInfo: any = {};
  openSubMenu = false;
  isDefault = true;
  isHavingUserProfile = false;
  tabSelect = '';
  constructor(
    private eRef: ElementRef,
    authService: AitAuthService,
    router: Router,
    private translateService: AitTranslationService,
    public dialogService: NbDialogService,
    store: Store<AppState>,
    userService: AitUserService,
    toatsrService: NbToastrService,
    private layoutSerive: AitLayoutService,
    envService: AitEnvironmentService,
    apollo: Apollo,
    private iconLibraries: NbIconLibraries
  ) {
    super(
      store,
      authService,
      apollo,
      userService,
      envService,
      null,
      toatsrService,
      null,
      router
    );
    this.iconLibraries.registerFontPack('font-awesome', {
      packClass: 'far',
      iconClassPrefix: 'fa',
    });
    // tslint:disable-next-line: deprecation
    store
      .pipe(select(getUFullName))
      .subscribe((name) => (this.fullName = name));
    store.pipe(select(getUserInfo)).subscribe((ob) => (this.userInfo = ob));

    // tslint:disable-next-line: deprecation
    store.pipe(select(getLang)).subscribe((lang) => {
      if (this.currentLang !== lang) {
        this.currentLang = lang;
        this.setupMenu();
      }
    });
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.isOpenMenu = false;
      }
    });

    // tslint:disable-next-line: deprecation
    store.pipe(select(getEmail)).subscribe((u) => {
      this.title = u;
    });

    const environment: any = envService;
    if (isArrayFull(environment?.MENU)) {
      this.menus = environment.MENU;
      this.isDefault = false;
    }

    const config = this.router?.config as any[];
    const index = config.findIndex(c => c.path === 'user-profile');
    if (index !== -1)
    {
      this.isHavingUserProfile = true;
    }
  }

  isUserLogined = () => this.authService.isLogined();
  navigateToMyProfile = () => this.router.navigateByUrl('/');
  navigateToJobList = () => this.router.navigateByUrl('/');
  navigateToPostAJob = () => this.router.navigateByUrl('/');

  getTitle = (string: string) => {
    return this.translateService.translate(string);
  };

  hover(tab: any) {
    this.tabSelect = tab?.title;
  }

  @HostListener('document:mouseout', ['$event'])
  mouseover(event: any) {
    if (event.target.matches('.sub_menu')) {
      this.tabSelect = '';
    }
  }

  ngOnInit() {
    this.setupMenu();
  }

  navigate = (link) => {
    if (link) {
      this.router.navigateByUrl(link);
    }
  };

  navigateApiHistory = () => {
    this.router.navigateByUrl('/');
  };

  toggleMenu = () => {
    this.isOpenMenu = !this.isOpenMenu;
  };

  naviagteToLogin = () => this.router.navigateByUrl('/sign-in');
  
  navigateToMangeJobs = () => this.router.navigateByUrl('/');

  openUserSetting() {
    this.router.navigate(['/user-setting']);
  }

  openUserChangePwd() {
    this.router.navigateByUrl('/change-password');
  }

  setupMenu = () => {
    this.store.pipe(select(getCaption)).subscribe(() => {
      if (this.isDefault) {
        this.menus = this.layoutSerive.MENU_USER;
      }
    });
  };

  getAvatar = () => {
    return this.fullName
      ? this.avatarURL + this.fullName.replace(' ', '+')
      : this.userInfo?.username
      ? this.avatarURL + this.userInfo?.username
      : this.avatarURL + this.userInfo?.email;
  };

  hideMenu = () => {
    this.isOpenMenu = false;

    this.tabSelect = '';
  };

  navigateCompanyCreate = () => {
    this.router.navigateByUrl('/');
  };

  logout = () => {
    this.authService.logout();
    this.router.navigateByUrl('/');
  };

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.eRef.nativeElement.contains(event.target)) {
    } else {
      this.isOpenMenu = false;
    }
  }

  getCommonTitle = () => {
    let titleSegment = '';
    if (this.userProfile?.title?.value && this.userProfile?.department?.value) {
      titleSegment = `${this.userProfile?.title?.value} at ${this.userProfile?.department?.value?.value}`;
    } else {
      titleSegment =
        this.userProfile?.title?.value || this.userProfile?.department?.value;
    }
    if (!this.userProfile?.company_working?.value) {
      return titleSegment;
    }
    return `${titleSegment}, ${this.userProfile?.company_working?.value}`;
  };
}
