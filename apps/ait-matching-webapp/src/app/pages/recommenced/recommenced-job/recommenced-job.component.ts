import { isArrayFull, KeyValueDto, RESULT_STATUS } from '@ait/shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NbIconLibraries,
  NbLayoutScrollService,
  NbToastrService,
} from '@nebular/theme';
import { select, Store } from '@ngrx/store';

import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitTranslationService,
  AppState,
  MODULES,
  PAGES,
  TabView,
} from '@ait/ui';
import { Apollo } from 'apollo-angular';
import { RecommencedUserService } from '../../../services/recommenced-user.service';
import { StoreKeywordsSearch } from '../../../state/actions';
import { SearchConditionService } from '../../../services/search-condition.service';

export enum StorageKey {
  KEYWORD = 'keyword',
  FILTER = 'filter',
}

@Component({
  selector: 'ait-recommenced-user',
  styleUrls: ['./recommenced-job.component.scss'],
  templateUrl: './recommenced-job.component.html',
})
export class RecommencedJobComponent
  extends AitBaseComponent
  implements OnInit {
  searchForm: FormGroup;
  currentCount = 0;
  constructor(
    layoutScrollService: NbLayoutScrollService,
    private matchingCompanyService: RecommencedUserService,
    private searchConditionService: SearchConditionService,
    private translateService: AitTranslationService,
    private iconLibraries: NbIconLibraries,
    private formBuilder: FormBuilder,
    store: Store<AppState | any>,
    authService: AitAuthService,
    router: Router,
    toastrService: NbToastrService,
    env: AitEnvironmentService,
    apollo: Apollo
  ) {
    super(
      store,
      authService,
      apollo,
      null,
      env,
      layoutScrollService,
      toastrService,
      null,
      router
    );

    this.searchForm = this.formBuilder.group({
      _key: new FormControl(null),
      keyword: new FormControl(null),
      skills: new FormControl(null),
      title: new FormControl(null),
      location: new FormControl(null),
      industry: new FormControl(null),
      level: new FormControl(null),
      valid_time_from: new FormControl(null),
      valid_time_to: new FormControl(null),
    });

    this.iconLibraries.registerFontPack('font-awesome-far', {
      packClass: 'far',
      iconClassPrefix: 'fa',
    });
    this.iconLibraries.registerFontPack('font-awesome-fas', {
      packClass: 'fas',
      iconClassPrefix: 'fa',
    });

    this.setModulePage({
      page: PAGES.RECOMMENCED_USER,
      module: MODULES.RECOMMENCED_USER,
    });

    store.pipe(select(this.getCaption)).subscribe(() => {
      const comma = this.translateService.translate('s_0001');
      if (comma !== 's_0001') {
        this.comma = comma;
      }
    });

    // tslint:disable-next-line: deprecation
    layoutScrollService.onScroll().subscribe((event: any) => {
      const path = AitAppUtils.getParamsOnUrl(true);
      if (path.includes('recommenced-user')) {
        this.loadNext(event);
      }
    });
  }

  tabs: TabView[] = [
    {
      title: 'Recommended',
      tabIcon: 'star',
      type: 'R',
    },
    {
      title: 'Save',
      tabIcon: 'bookmark',
      type: 'S',
    },
  ];
  comma = '、';

  cardSkeleton = Array(8).fill(1);
  textDataNull = '';
  textDataNullSave = '';
  isExpan = false;
  currentTab = 'R';
  dataFilter = [];
  dataFilterDf = [];
  isShowViewBtn = true;
  isReset = false;

  dataFilterSave = [];
  dataFilterSaveDf = [];
  dataIncludesIdSave = [];

  messageSearch = '';

  isLoading = true;
  spinnerLoading = false;
  isExpan1 = true;
  round = 1;
  currentSearch: any = {};
  companyName = '';
  filterCommon: any = {};
  filterCommonAppended: any = {};
  currentRound = 0;
  textDataEnd = '';
  disableTab = false;

  getNummberMode8 = (target: number) => {
    if (target === 0) {
      return 8;
    }
    if (target) {
      const num = target.toString();
      const lastString = num[num.length - 1];
      return 2 * 8 - Number(lastString);
    }
    return 0;
  };

  setSkeleton = (flag?: boolean) => {
    if (flag === undefined) {
      this.cardSkeleton = Array(this.getNummberMode8(0)).fill(1);
    } else if (this.currentTab === 'R') {
      if (flag) {
        this.cardSkeleton = Array(
          this.getNummberMode8(this.dataFilter.length)
        ).fill(1);
      } else {
        this.cardSkeleton = [];
      }
    } else {
      if (flag) {
        this.cardSkeleton = Array(
          this.getNummberMode8(this.dataFilterSave.length)
        ).fill(1);
      } else {
        this.cardSkeleton = [];
      }
    }
  };

  isObjectEmpty = (obj) => Object.keys(obj || {}).length === 0;

  removeSearch = (isPrevented = false, isButton = false) => {
    this.dataFilter = [];
    this.dataIncludesIdSave = [];
    this.dataFilterSave = [];
    this.dataFilterSaveDf = [];
    this.dataFilterDf = [];
    this.textDataNull = '';
    this.textDataNullSave = '';
    this.textDataEnd = '';
    this.currentRound = 0;
    this.resetRound();
    this.store.dispatch(new StoreKeywordsSearch({}));
    localStorage.removeItem(StorageKey.KEYWORD + `_${this.user_id}`);
    localStorage.removeItem(StorageKey.FILTER + `_${this.user_id}`);
    this.currentTab = 'R';
    this.disableTab = true;
    setTimeout(() => {
      this.disableTab = false;
    }, 200);

    if (!isPrevented) {
      this.currentSearch = {};
      if (isButton) {
        this.isExpan = true;
        this.setSkeleton(true);
        this.callSearchAll();
      }
    } else {
      this.isExpan = true;
      this.setSkeleton(true);
      this.callSearchAll();
    }
  };

  goTop = () => {
    this.gotoTop();
  };

  private getDetailMatching = async (list = [], onlySaved = false, start = 0, end = 8) => {
    const res = await this.matchingCompanyService.getDetailMatching(
      onlySaved,
      start * 8,
      end
    );

    if (res.status === RESULT_STATUS.OK) {
      if (res.data?.length === 0) {
        this.textDataNull = '021';
      }
      return res.data;
    }
  };

  getDataClone = (data) => {
    return AitAppUtils.deepCloneArray(data || []);
  };

  handleSyncData = ($event) => {
    const { user_id, is_saved } = $event;
    const find = this.dataFilterDf.find((f) => f.user_id === user_id);
    const currentFind = this.dataFilter.find((f) => f.user_id === user_id);
    if (find) {
      find.is_saved = is_saved;
    }

    if (currentFind) {
      currentFind.is_saved = is_saved;
    }
  };

  ToggleExpan = () => (this.isExpan = !this.isExpan);
  ToggleExpan1 = () => {
    this.isExpan1 = !this.isExpan1;
  };

  submitSearch = () => {
    this.isLoading = true;
    // this.setSkeleton(true);
  };

  filterMain = () => {
    //
  };

  handleClickChipInput(e) {
    e.preventDefault();
  }

  filterByCondition = (val: any, type: string) => {
    const value = val?.value || [];
    const target = this.getValueFromMaster(value);
    this.filterCommon = { ...this.filterCommon, [type]: target };
    this.filterMain();
  };

  getValueFromMaster(value: any[]) {
    if (value.length === 0) {
      return [];
    } else {
      const result = [];
      (value || []).forEach((e) => {
        if (e?._key) {
          result.push(e?._key);
        }
      });
      return result;
    }
  }

  getTitle = (name: string) => this.translateService.translate(name);

  async ngOnInit() {
    // eslint-disable-next-line no-constant-condition
    if (false) {
      this.searchConditionService.find().then((e) => {
        this.searchForm.patchValue(e.data[0]);
      });
    }
    this.callSearchAll();
  }

  preventScroll = () => {
    window.onunload = function () {
      window.scrollTo(0, 500);
    };

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  };

  private callSearchAll() {
    this.isExpan = true;
    this.getDataByRound().then(() => {
      this.setSkeleton(false);
    });
  }

  loadNext = (event) => {
    if (this.cardSkeleton.length === 0 || this.dataFilter.length !== 0) {
      const pos =
        (event.target.scrollTop || document.body.scrollTop) +
        document.documentElement.offsetHeight;
      const max = event.target.scrollHeight;
      // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
      if (pos >= max) {
        if (!this.spinnerLoading) {
          // Coding something 😋😋😋
          if (this.currentTab === 'R' && this.textDataEnd === '') {
            if (this.dataFilter.length >= 8) {
              this.setSkeleton(true);
              this.getDataByRound().then(() => this.setSkeleton(false));
            } else {
              this.textDataEnd = '022';
            }
          } else {
            if (this.dataIncludesIdSave.length >= 8) {
              this.setSkeleton(true);
            } else {
              this.textDataEnd = '022';
            }
          }
        }
      }
    }
  };

  getTitleSearchBtn = () => this.translateService.translate('002');
  getTitleSaveBtn = () => this.translateService.translate('save');

  getTitlePlaceholderSearch = () => this.translateService.translate('001');

  // Get Data by round and base on all of result
  getDataByRound = async (onlySaved = false) => {
    const detail = await this.getDetailMatching([], onlySaved, this.currentCount);
    if (isArrayFull(detail) && !onlySaved) {
      this.dataFilter = this.dataFilter.concat(detail);
      this.currentCount = Math.ceil(this.dataFilter.length / 8);
    }
    if (isArrayFull(detail) && onlySaved) {
      this.dataFilterSave = this.dataFilterSave.concat(detail);
      this.currentCount = Math.ceil(this.dataFilterSave.length / 8);
    }
    if (
      detail.length === 0 &&
      ((this.dataFilter.length !== 0 && !onlySaved) ||
        (this.dataFilterSave.length !== 0 && onlySaved))
    ) {
      this.textDataNull = '';
      this.textDataNullSave = '';
      this.textDataEnd = '022';
      this.setSkeleton(false);
    }
  };

  // thêm nút scroll to top : TODO
  resetRound = () => (this.round = 1);

  getTabSelect = (tab) => {
    this.dataFilterSave = [];
    this.dataFilterSaveDf = [];
    this.dataFilterDf = [];
    this.dataFilter = [];
    this.textDataNull = '';
    this.textDataNullSave = '';
    this.textDataEnd = '';
    this.currentRound = 0;
    this.cardSkeleton = [];
    this.isLoading = true;
    this.resetRound();
    this.currentTab = tab.value;
    if (this.currentTab === 'R') {
      this.setSkeleton(true);
      this.getDataByRound().then(() => this.setSkeleton(false));
    } else {
      this.setSkeleton(true);
      this.getDataByRound(true).then(() => this.setSkeleton(false));
    }
  };

  // Take values form components and assign to form
  takeMasterValues(value: KeyValueDto[], form: string): void {
    if (isArrayFull(value)) {
      this.searchForm.controls[form].markAsDirty();
      this.searchForm.controls[form].setValue(value);
    } else {
      this.searchForm.controls[form].setValue(null);
    }
  }

  takeDatePickerValue(value: number, form: string): void {
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this.searchForm.controls[form].markAsDirty();
      this.searchForm.controls[form].setValue(value);
    } else {
      this.searchForm.controls[form].setValue(null);
    }
  }

  reset(): void {
    const _key = this.searchForm.controls['_key'].value;
    try {
      this.searchForm.reset();
      this.isReset = true;
      setTimeout(() => {
        this.isReset = false;
      }, 100);
      this.showToastr('', this.getMsg('I0007'));
    } catch (e) {
      console.log(e);
    }
    if (_key) {
      this.searchConditionService.remove(_key);
    }
  }

  save(): void {
    const data = this.searchForm.value;
    const obj = {};
    for (const prop in data) {
      if (data[prop]) {
        obj[prop] = data[prop];
      }
    }
    this.searchConditionService.save(obj).then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        this.searchForm.controls['_key'].setValue(res.data[0]?._key || '');
      }
    });
  }
}
