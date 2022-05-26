/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isArrayFull,
  isObjectFull,
  KEYS,
  KeyValueDto,
  RESULT_STATUS,
} from '@ait/shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NbDialogService,
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
import { RecommencedUserService } from '../../services/recommenced-user.service';
import { StoreKeywordsSearch } from '../../state/actions';
import { SearchConditionService } from '../../services/search-condition.service';
import { SetNameComponent } from './components/set-name/set-name.component';
import _ from 'lodash';

export enum StorageKey {
  KEYWORD = 'keyword',
  FILTER = 'filter',
}

@Component({
  selector: 'ait-recommenced-user',
  styleUrls: ['./recommenced-user.component.scss'],
  templateUrl: './recommenced-user.component.html',
})
export class RecommencedUserComponent
  extends AitBaseComponent
  implements OnInit {
  searchForm: FormGroup;
  currentCount = 0;
  currentMatchingCount = 0;
  constructor(
    layoutScrollService: NbLayoutScrollService,
    private matchingService: RecommencedUserService,
    private searchConditionService: SearchConditionService,
    private translateService: AitTranslationService,
    private iconLibraries: NbIconLibraries,
    private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
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
      current_job_title: new FormControl(null),
      province_city: new FormControl(null),
      industry_working: new FormControl(null),
      current_job_level: new FormControl(null),
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
  isShowViewBtn = true;
  isReset = false;

  dataFilter = [];
  dataFilterDf = [];

  dataMatching = [];
  dataMatchingDf = [];

  dataFilterSave = [];
  dataFilterSaveDf = [];

  dataMatchingSave = [];
  dataMatchingSaveDf = [];

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
  isMatchingSearch = false;
  isSubmit = false;

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

  private getDetailMatching = async (
    list = [],
    onlySaved = false,
    start = 0,
    end = 8
  ) => {
    if (list.length === 0) {
      const res = await this.matchingService.getDetailMatching(
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
    } else {
      const res = await this.matchingService.getUserByList(
        list,
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

  handleClickChipInput(e) {
    e.preventDefault();
  }

  filterByCondition = (val: any, type: string) => {
    const value = val?.value || [];
    const target = this.getValueFromMaster(value);
    this.filterCommon = { ...this.filterCommon, [type]: target };
    // this.filterMain();
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
    const queriesKey = localStorage.getItem('my-project-queries');
    if (queriesKey) {
      this.searchConditionService.find({ _key: queriesKey }).then((e) => {
        this.searchForm.patchValue(e.data[0]);
        localStorage.setItem('my-project-queries', null);
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
    if (this.isMatchingSearch) {
      return;
    }
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
    try {
      const detail = await this.getDetailMatching(
        [],
        onlySaved,
        this.currentCount
      );
      if (isArrayFull(detail) && !onlySaved) {
        this.dataFilter = this.dataFilter.concat(detail);
        this.dataFilterDf = [...this.dataFilter];
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
    } catch (e) {
      console.log(e);
    }
  };

  getDataByList = async (list: string[], onlySaved = false) => {
    try {
      const detail = await this.getDetailMatching(
        list,
        onlySaved,
        this.currentMatchingCount
      );
      if (isArrayFull(detail) && !onlySaved) {
        this.dataMatching = this.dataMatching.concat(detail);
        this.dataMatchingDf = [...this.dataMatching];
        this.currentMatchingCount = Math.ceil(this.dataMatching.length / 8);
      }
      if (isArrayFull(detail) && onlySaved) {
        this.dataMatchingSave = this.dataMatchingSave.concat(detail);
        this.currentMatchingCount = Math.ceil(this.dataMatchingSave.length / 8);
      }
      if (
        detail.length === 0 &&
        ((this.dataMatching.length !== 0 && !onlySaved) ||
          (this.dataMatchingSave.length !== 0 && onlySaved))
      ) {
        this.textDataNull = '';
        this.textDataNullSave = '';
        this.textDataEnd = '022';
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setSkeleton(false);
    }
  };

  search() {
    this.isSubmit = true;
    const keyword = this.searchForm.controls['keyword'].value;
    if (!keyword) {
      this.isMatchingSearch = false;
      this.dataFilter = [];
      this.dataFilterDf = [];

      this.setSkeleton(true);
      this.callSearchAll();
      setTimeout(() => {
        this.setSkeleton(false);
      }, 500);
      return;
    }
    this.setSkeleton(true);
    if (keyword) {
      this.isMatchingSearch = true;
      this.matchingService.matchingUser(keyword).then((res) => {
        if (res?.data.length > 0) {
          const arr = res.data.map((e: { item: string }) => e.item);
          this.getDataByList(arr);
          return;
          this.matchingFilter(arr);
        }
      });
    } else {
      this.dataFilter = this.dataFilterDf;
    }
  }

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
    this.filterMain(0);
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
    // this.filterMain();
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
    this.dataFilter = [...this.dataFilterDf];
  }

  showQueryList() {
    this.router.navigate([`/my-project-queries`]);
  }

  matchingFilter(arr: string[]) {
    this.dataFilter = this.dataFilter.filter((e) => arr.includes(e.user_id));
  }

  save(): void {
    this.dialogService
      .open(SetNameComponent, {
        closeOnBackdropClick: true,
        hasBackdrop: true,
        autoFocus: false,
      })
      .onClose.subscribe(async (name) => {
        try {
          if (name) {
            const data = this.searchForm.value;
            const obj = { name };
            for (const prop in data) {
              if (data[prop]) {
                if (isArrayFull(data[prop])) {
                  const result = [];
                  data[prop].forEach((e: KeyValueDto) => {
                    result.push(e?._key ?? '');
                  });
                  obj[prop] = result;
                } else {
                  obj[prop] = data[prop];
                }
              }
            }
            this.searchConditionService.save(obj).then((res) => {
              if (res.status === RESULT_STATUS.OK) {
                this.searchForm.controls['_key'].setValue(
                  res.data[0]?._key || ''
                );
                this.showToastr('', this.getMsg('I0005'));
              } else {
                this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
              }
            });
          }
        } catch (e) {
          console.log(e);
        }
      });
  }

  filterMain(type: number) {
    const isMatching = this.isMatchingSearch;
    try {
      const formValue = this.searchForm.value;
      const condition = Object.entries(formValue).reduce(
        (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
        {}
      );
      isMatching && delete condition['keyword'];
      const checkList = [];
      for (const prop in condition) {
        if (prop !== 'keyword') {
          checkList.push(condition[prop].map((t: any) => t['_key']));
        }
      }
      const keyList = _.flatten(checkList);
      if (isObjectFull(condition) && type === 0) {
        const dataList = isMatching
          ? [...this.dataMatchingDf]
          : [...this.dataFilterDf];
        const daveForFilter = dataList.filter((m) => {
          let isValid = true;
          for (const prop in condition) {
            if (isArrayFull(condition[prop]) && isArrayFull(m[prop])) {
              isValid = m[prop].some((z: any) => keyList.includes(z['_key']));
              if (!isValid) break;
            } else if (isArrayFull(condition[prop]) && isObjectFull(m[prop])) {
              isValid = [m[prop]].some((z: any) => keyList.includes(z['_key']));
              if (!isValid) break;
            } else {
              isValid = false;
              break;
            }
          }
          return isValid;
        });
        if (isMatching) {
          this.dataMatching = daveForFilter;
        } else {
          this.dataFilter = daveForFilter;
        }
      } else {
        if (isMatching) {
          this.dataMatching = [...this.dataMatchingDf];
        } else {
          this.dataFilter = [...this.dataFilterDf];
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}
