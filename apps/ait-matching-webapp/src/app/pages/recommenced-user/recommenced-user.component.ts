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
import { BizProjectService } from '../../services/biz_project.service';
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
    private bizProjectService: BizProjectService,
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
      keyword: new FormControl('window'),
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
      title: 'Candidates',
      tabIcon: 'list',
      type: 'C',
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
  isReset = false;

  dataFilter = [];
  dataFilterDf = [];

  dataFilterSave = [];
  dataFilterSaveDf = [];

  matchingList = [];
  matchingSkill = [];
  matchingResult = [];

  isLoading = true;
  spinnerLoading = false;
  isExpan1 = true;
  round = 1;
  textDataEnd = '';
  disableTab = false;
  isSubmit = false;

  getResultCount() {
    if (this.matchingList.length > 0) {
      return `About ${this.matchingList.length} results`;
    }
    return '';
  }

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
          this.textDataNull = 'There is no data to search';
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
          this.textDataNull = 'There is no data to search';
        }
        return res.data;
      }
    }
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

  getTitle = (name: string) => this.translateService.translate(name);

  async ngOnInit() {
    const queriesKey = localStorage.getItem('my-project-queries');
    if (queriesKey) {
      this.bizProjectService.find({ _key: queriesKey }).then((e) => {
        this.searchForm.patchValue(e.data[0]);
        localStorage.setItem('my-project-queries', null);
      });
    }
  }

  private callSearch(list = []) {
    this.isExpan = true;
    this.getDataByRound(false, list).then(() => {
      this.setSkeleton(false);
    });
  }

  loadNext = (event: any) => {
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
            if (this.dataFilterDf.length >= 8) {
              this.setSkeleton(true);
              this.getDataByRound(false, this.matchingList).then(() => {
                this.filterMain();
                this.setSkeleton(false);
              });
            } else {
              this.textDataEnd = 'Out of data';
            }
          }
        }
      }
    }
  };

  getTitleSearchBtn = () => this.translateService.translate('002');
  getTitleSaveBtn = () => this.translateService.translate('save');

  getTitlePlaceholderSearch = () => this.translateService.translate('001');

  getGroupNo(key: string) {
    const obj = this.matchingResult.find((e) => e.item === key);
    if (obj) {
      const num = obj['total_score'] || 0.2;
      if (num >= 0.6) {
        return 1;
      } else if (num >= 0.2) {
        return 2;
      } else {
        return 3;
      }
    } else {
      return 3;
    }
  }

  // Get Data by round and base on all of result
  getDataByRound = async (onlySaved = false, list = []) => {
    try {
      const detail = await this.getDetailMatching(
        list,
        onlySaved,
        this.currentCount
      );
      if (isArrayFull(detail) && !onlySaved) {
        const temp = this.dataFilterDf
          .concat(detail)
          .map((e) =>
            Object.assign({
              ...e,
              group_no: this.getGroupNo(e.user_id),
            })
          )
          .sort((a, b) => a.group_no - b.group_no);
        this.dataFilter = [...temp];
        this.dataFilterDf = [...temp];
        this.currentCount = Math.ceil(this.dataFilterDf.length / 8);
      }
      if (isArrayFull(detail) && onlySaved) {
        this.textDataNullSave = '';
        this.dataFilterSave = this.dataFilterSave.concat(detail);
        this.currentCount = Math.ceil(this.dataFilterSave.length / 8);
      } else {
        this.textDataNullSave = 'There is no data';
      }
      if (
        detail.length === 0 &&
        ((this.dataFilter.length !== 0 && !onlySaved) ||
          (this.dataFilterSave.length !== 0 && onlySaved))
      ) {
        this.textDataNull = '';
        this.textDataNullSave = '';
        this.textDataEnd = 'Out of data';
        this.setSkeleton(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  search() {
    const keyword = this.searchForm.controls['keyword'].value || '';
    if (!keyword) {
      this.showToastr('', this.getMsg('Please input your keyword!'), 'warning');
      return;
    }
    this.isSubmit = true;
    this.dataFilter = [];
    this.dataFilterDf = [];
    this.matchingList = [];
    this.currentCount = 0;
    this.textDataEnd = '';
    this.setSkeleton(true);
    this.matchingService.matchingUser(keyword).then((res) => {
      console.log(res);
      this.matchingResult = res?.data[0].data || [];
      if (this.matchingResult.length > 0) {
        const arr = res.data[0].data.map((e: { item: string }) => e.item);
        const matchingSkill = res.data[0].matching_input_data.skill.map(
          (e: any) => Object.assign({ ...e, count: 0, name: '' })
        ) as any[];
        matchingSkill.length = 4;
        const checkArr = [];
        res.data[0].data.forEach((e: any) => {
          checkArr.push(
            e.matching_attributes[0]?.matching_detail?.item_values || []
          );
        });
        checkArr.forEach((e: any[]) => {
          matchingSkill.forEach((z, i) => {
            const index = e.findIndex((w) => w === z.item);
            if (~index) {
              matchingSkill[i].count += 1;
            }
          });
        });
        matchingSkill.forEach(async (e, i) => {
          const name = await this.matchingService.findSkillName(e.item);
          matchingSkill[i].name = name;
        });
        this.matchingSkill = [{ name: 'All', count: arr.length }].concat(
          matchingSkill
        );
        this.matchingList = arr || [];
        this.callSearch(arr);
      } else {
        this.textDataNull = 'There is no data to search';
        this.setSkeleton(false);
      }
    });
  }

  // thêm nút scroll to top : TODO
  resetRound = () => (this.round = 1);

  getText = (p: any) => {
    if (p.name && p.count > 0) {
      return `${p.name} (${p.count})`;
    }
  };

  getTabSelect = (tab: any) => {
    this.dataFilterSave = [];
    this.dataFilterSaveDf = [];
    this.dataFilterDf = [];
    this.dataFilter = [];
    this.textDataNull = '';
    this.textDataNullSave = '';
    this.textDataEnd = '';
    this.cardSkeleton = [];
    this.isLoading = true;
    this.resetRound();
    this.currentCount = 0;
    this.currentMatchingCount = 0;
    this.currentTab = tab.value;
    if (this.currentTab === 'R') {
      this.setSkeleton(true);
      this.callSearch(this.matchingList || []);
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
    this.filterMain();
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
      this.bizProjectService.remove(_key);
    }
    this.dataFilter = [...this.dataFilterDf];
  }

  showQueryList() {
    this.router.navigate([`/requirement-list`]);
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
            console.log(data);
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
            console.log(obj);
            const saveData = {
              keyword: obj['keyword'],
              name: obj['name'],
            };
            if (obj['current_job_level']) {
              saveData['level'] = obj['current_job_level'];
            }
            if (obj['current_job_title']) {
              saveData['title'] = obj['current_job_title'];
            }
            if (obj['industry_working']) {
              saveData['industry'] = obj['industry_working'];
            }
            if (obj['province_city']) {
              saveData['location'] = obj['province_city'];
            }
            if (obj['valid_time_from']) {
              saveData['valid_time_from'] = obj['valid_time_from'];
            }
            if (obj['valid_time_to']) {
              saveData['valid_time_to'] = obj['valid_time_to'];
            }
            if (obj['skills']) {
              saveData['skills'] = obj['skills'];
            }
            this.bizProjectService.save(saveData).then((res) => {
              if (res.status === RESULT_STATUS.OK) {
                // this.searchForm.controls['_key'].setValue(
                //   res.data[0]?._key || ''
                // );
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

  setHours0(time: number) {
    return new Date(time).setHours(0, 0, 0, 0);
  }

  filterMain(type = 0) {
    try {
      const formValue = this.searchForm.value;
      const condition = Object.entries(formValue).reduce(
        (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
        {}
      );
      condition['keyword'] && delete condition['keyword'];
      const checkList = [];
      for (const prop in condition) {
        if (
          prop !== 'keyword' &&
          prop !== 'valid_time_from' &&
          prop !== 'valid_time_to'
        ) {
          checkList.push(condition[prop].map((t: any) => t['_key']));
        }
      }
      const keyList = _.flatten(checkList);
      if (isObjectFull(condition) && type === 0) {
        const dataList = [...this.dataFilterDf];
        const daveForFilter = dataList.filter((m) => {
          let isValid = true;
          for (const prop in condition) {
            if (isArrayFull(condition[prop]) && isArrayFull(m[prop])) {
              isValid = m[prop].some((z: any) => keyList.includes(z['_key']));
              if (!isValid) break;
            } else if (isArrayFull(condition[prop]) && isObjectFull(m[prop])) {
              isValid = [m[prop]].some((z: any) => keyList.includes(z['_key']));
              if (!isValid) break;
            } else if (prop === 'valid_time_from' || prop === 'valid_time_to') {
              if (condition['valid_time_from'] && !condition['valid_time_to']) {
                isValid =
                  this.setHours0(condition['valid_time_from']) <=
                  this.setHours0(m['create_at']);
                if (!isValid) break;
              } else if (
                !condition['valid_time_from'] &&
                condition['valid_time_to']
              ) {
                isValid =
                  this.setHours0(condition['valid_time_to']) >=
                  this.setHours0(m['create_at']);
                if (!isValid) break;
              } else {
                isValid =
                  this.setHours0(condition['valid_time_from']) <=
                    this.setHours0(m['create_at']) &&
                  this.setHours0(condition['valid_time_to']) >=
                    this.setHours0(m['create_at']);
                if (!isValid) break;
              }
            } else {
              isValid = false;
              break;
            }
          }
          return isValid;
        });
        this.dataFilter = daveForFilter;
      } else {
        this.dataFilter = [...this.dataFilterDf];
      }
    } catch (e) {
      console.log(e);
    }
  }
}
