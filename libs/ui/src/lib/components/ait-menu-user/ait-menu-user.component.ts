import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NbDialogService, NbIconLibraries, NbMenuService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { filter, map } from 'rxjs/operators';
import { AitAuthService, AitEnvironmentService, AitTranslationService, AitUserService } from '../../services';
import { AitLayoutService } from '../../services/common/ait-layout.service';
import { AppState, getCaption, getEmail, getLang, getUFullName, getUserInfo, getUserProfile } from '../../state/selectors';
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
  tabSelect = '';
  constructor(
    private eRef: ElementRef,
    authService: AitAuthService,
    private router: Router,
    private translateService: AitTranslationService,
    public dialogService: NbDialogService,
    store: Store<AppState>,
    userService: AitUserService,
    toatsrService: NbToastrService,
    private layoutSerive: AitLayoutService,
    envService: AitEnvironmentService,
    apollo: Apollo,
    private iconLibraries: NbIconLibraries,
  ) {
    super(store, authService, apollo, userService, envService, null, toatsrService);
    this.iconLibraries.registerFontPack('font-awesome', { packClass: 'far', iconClassPrefix: 'fa' });
    // tslint:disable-next-line: deprecation
    store.pipe(select(getUFullName)).subscribe(name => this.fullName = name);
    store.pipe(select(getUserInfo)).subscribe(ob => this.userInfo = ob);

    // tslint:disable-next-line: deprecation
    store.pipe(select(getLang)).subscribe(lang => {
      if (this.currentLang !== lang) {
        this.currentLang = lang;
        this.setupMenu();
      }
    });
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.isOpenMenu = false;
      }
    })

    // tslint:disable-next-line: deprecation
    store.pipe(select(getEmail)).subscribe(u => {
      this.title = u;
    });
  }

  isUserLogined = () => this.authService.isLogined();
  navigateToMyProfile = () => this.router.navigateByUrl('/');
  navigateToJobList = () => this.router.navigateByUrl('/');
  navigateToPostAJob = () => this.router.navigateByUrl('/');

  getTitle = (string: string) => {
    return this.translateService.translate(string);
  }

  hover(tab: any) {
    console.log('in')
    this.tabSelect = tab?.title;
  }

  @HostListener('document:mouseout', ['$event'])
  mouseover(event) {
    if (event.target.matches('.sub_menu')) {
      // alert('out')
      this.tabSelect = '';
    }


  }

  ngOnInit() {
    this.setupMenu();
    // this.nbMenuService.onItemClick()
    //   .pipe(
    //     // filter(({ tag }) => tag === 'person'),
    //     map(({ item }) => item),
    //   )
    //   .subscribe((item: any) => {
    //     this.router.navigateByUrl(item.url_sub);
    //   });

  }
  navigate = (link) => {
    if (link) {
      this.router.navigateByUrl(link);
    }
  }

  navigateApiHistory = () => {
    this.router.navigateByUrl('/');
  }

  toggleMenu = () => {
    this.isOpenMenu = !this.isOpenMenu;
  }

  naviagteToLogin = () => this.router.navigateByUrl('/sign-in');
  navigateToMangeJobs = () => this.router.navigateByUrl('/');

  openUserSetting(mode?: string) {

    this.router.navigate(['/user-setting']);
  }


  openUserChangePwd(mode?: string) {

    this.router.navigateByUrl('/change-password')
  }



  setupMenu = () => {
    this.store.pipe(select(getCaption)).subscribe(() => {
      this.menus = this.layoutSerive.MENU_USER;
    })
  }

  getAvatar = () => {

    return this.fullName ? this.avatarURL + this.fullName.replace(' ', '+') :
      this.userInfo?.username ?
        this.avatarURL + this.userInfo?.username : this.avatarURL + this.userInfo?.email;
  }

  hideMenu = () => {

    this.isOpenMenu = false;

    this.tabSelect = '';

  }

  navigateCompanyCreate = () => {
    this.router.navigateByUrl('/');
  }

  logout = () => {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
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
      titleSegment = this.userProfile?.title?.value || this.userProfile?.department?.value;

    }
    if (!this.userProfile?.company_working?.value) {

      return titleSegment;
    }

    return `${titleSegment}, ${this.userProfile?.company_working?.value}`;
  }
}
