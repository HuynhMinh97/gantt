/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CompanyInfoDto,
  hasLength,
  isArrayFull,
  KeyValueDto,
  RESULT_STATUS,
} from '@ait/shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import {
  NbIconLibraries,
  NbLayoutScrollService,
  NbToastrService,
} from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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

  isNavigate = false;
  currentKeyword = {};
  currentCondition = {};
  master_data_fields = [
    'gender',
    'business',
    'prefecture',
    'residence_status',
    'work',
  ];
  inputVal = '';
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
    router.events.subscribe((val) => {
      // see also
      if (val instanceof NavigationStart) {
        this.isNavigate = true;
      }
    });

    store.pipe(select(this.getCaption)).subscribe(() => {
      const comma = this.translateService.translate('s_0001');
      if (comma !== 's_0001') {
        this.comma = comma;
      }
    });

    // tslint:disable-next-line: deprecation
    layoutScrollService.onScroll().subscribe((e) => {
      const path = AitAppUtils.getParamsOnUrl(true);

      if (path.includes('candidates')) {
        this.loadNext(e);
      }
    });
    this.inputControlMaster = new FormControl('');
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
  dataSuggestAll = [];
  isExpan = false;
  currentTab = 'R';
  employeeData = [];
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
  dataSuggest = [];
  companySelect = [];
  addressSearch = '';
  inputControlMaster: FormControl;
  dataIncludesId = [];
  company_key = '';
  currentDataCard = [];

  filterCommon: any = {};
  filterCommonAppended: any = {};
  currentRound = 0;
  textDataEnd = '';

  company_keys = [];
  isSearchButton = false;
  isResetSalaryFrom = false;
  isResetSalaryTo = false;

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
      this.currentDataCard = this.dataFilter;
      if (flag) {
        this.cardSkeleton = Array(
          this.getNummberMode8(this.dataFilter.length)
        ).fill(1);
      } else {
        this.cardSkeleton = [];
        this.dataFilter = this.currentDataCard;
      }
    } else {
      this.currentDataCard = this.dataFilterSave;
      if (flag) {
        //
        this.cardSkeleton = Array(
          this.getNummberMode8(this.dataFilterSave.length)
        ).fill(1);
      } else {
        this.cardSkeleton = [];
        this.dataFilterSave = this.currentDataCard;

        //
      }
    }
  };

  isObjectEmpty = (obj) => Object.keys(obj || {}).length === 0;

  removeSearch = (isPrevented = false, isButton = false) => {
    this.dataFilter = [];
    this.dataIncludesId = [];
    this.dataIncludesIdSave = [];
    this.dataFilterSave = [];
    this.dataFilterSaveDf = [];
    this.dataFilterDf = [];
    this.textDataNull = '';
    this.textDataNullSave = '';
    this.textDataEnd = '';
    this.currentRound = 0;
    this.resetRound();
    this.inputControlMaster.patchValue('');
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

  private matchingCompany = async (_key: string) => {
    const filter = this.filterCommon;
    const res = await this.matchingCompanyService.matchingCompany(_key);

    if (res.status === RESULT_STATUS.OK) {
      const data = res.data;
      if (data && data?.length !== 0) {
        this.dataIncludesId = data;
        this.filterCommon = filter;
      } else {
        this.setSkeleton(false);
        this.textDataNull = '021';
      }
    }
  };

  private getDetailMatching = async () => {
    const res = await this.matchingCompanyService.getDetailMatching();
    console.log(res);
    
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

    this.matchingCompany(this.company_key || null).then((m) => {
      this.getDataByRound().then();
    });
  };

  filterMain = () => {
    // tslint:disable-next-line: no-console

    const condition = {};

    //salary_from (nhập từ màn hình)  - 30.000 <= desired_salary <= salary_to (nhập từ màn hình) + 30.000

    // remark
    // business
    // gender
    // prefecture
    // desired_salary
    console.log(this.dataFilterDf);

    const result = this.dataFilterDf.filter((f) => {
      let check = [];

      Object.entries(this.filterCommon).forEach(([key, value]) => {
        console.log(key, value);
        const isValid = this.checkValidForFilter(value);
        if (isValid) {
          condition[key] = value;
          if (!key.includes('salary')) {
            if (this.master_data_fields.includes(key)) {
              if (isArrayFull(f[key])) {
                const map = f[key].map((m) => m?.value);
                //mannq change
                // check = [...check, map.includes(value)];
                check = [
                  ...check,
                  map.some((v: string) => ~(value as any[]).indexOf(v)),
                ];
              } else {
                //mannq change
                // check = [...check, f[key]?._key === value];
                check = [...check, (value as any[]).includes(f[key]?._key)];
              }
            } else {
              check = [...check, f[key]?.includes(value)];
            }
          } else {
            //Truong hop co cả 2 salary
            //                          110000        <= x <= 180000
            //salary_from(nhập từ màn hình) - 30.000 <= desired_salary <= salary_to(nhập từ màn hình) + 30.000
            if (this.filterCommon['salary1'] && this.filterCommon['salary2']) {
              if (!f?.desired_salary) {
                check = [...check, false];
              } else {
                const match =
                  (f?.desired_salary || 0) >=
                    this.acceptedSalary(this.filterCommon['salary1'], true) &&
                  (f?.desired_salary || 0) <=
                    this.acceptedSalary(this.filterCommon['salary2']);
                check = [...check, match];
              }
            }
            // Truong hop chi co salary 1 salary_from (nhập từ màn hình) - 30.000 <= desired_salary
            else if (this.filterCommon['salary1']) {
              if (!f?.desired_salary) {
                check = [...check, false];
              } else {
                const match2 =
                  (f?.desired_salary || 0) >=
                  this.acceptedSalary(this.filterCommon['salary1'], true);
                check = [...check, match2];
              }

              // Truong hop chi co salary 2 desired_salary <= salary_to (nhập từ màn hình) + 30.000
            } else if (this.filterCommon['salary2']) {
              if (!f?.desired_salary) {
                check = [...check, false];
              } else {
                const match3 =
                  (f?.desired_salary || 0) <=
                  this.acceptedSalary(this.filterCommon['salary2']);
                check = [...check, match3];
              }
            }
          }
        }
      });

      return (
        check.length !== 0 &&
        !check.includes(false) &&
        !check.includes(undefined)
      );
    });
    console.log(result);

    const res1 = AitAppUtils.getUniqueArray(this.sortByGroup(result), '_key');
    const res2 = AitAppUtils.getUniqueArray(this.sortByGroup(result), '_key');

    this.dataFilter = res1;
    this.dataFilterSave = res2;
    this.currentCondition = condition;

    if (AitAppUtils.isObjectEmpty(condition)) {
      this.dataFilter = this.dataFilterDf;
      this.dataFilterSave = this.dataFilterSaveDf;
    }

    if (this.dataFilter.length === 0) {
      this.textDataNull = '021';
    }

    if (this.dataFilterSave.length === 0) {
      this.textDataNullSave = '021';
    }

    localStorage.setItem(
      StorageKey.FILTER + `_${this.user_id}`,
      JSON.stringify({ ...this.filterCommon })
    );
  };

  checkValidForFilter(value: any) {
    if (Array.isArray(value)) {
      return hasLength(value);
    } else if (value) {
      return true;
    } else {
      return false;
    }
  }

  acceptedSalary = (salary: number, isFirst?: boolean) => {
    const target = salary || 0;

    // return isFirst ? target - 30000 : target + 30000;
    return target;
  };

  filterRemark = (value) => {
    const filter = of(value);
    filter.pipe(distinctUntilChanged(), debounceTime(200)).subscribe((text) => {
      this.filterCommon = { ...this.filterCommon, remark: text };
      this.filterMain();
    });
  };

  handleClickChipInput(e) {
    e.preventDefault();
  }

  checkValidRangeNumber = (field: string, salary) => {
    // case reset salary1
    // if (field === 'salary1') {

    //   if (this.filterCommon['salary2'] && salary > this.filterCommon['salary2']) {
    //     this.isResetSalaryFrom = true;
    //     this.filterCommon['salary1'] = null;
    //   }
    //   else {
    //     this.filterCommon = { ...this.filterCommon, [field]: salary };

    //   }
    // }
    // else {
    //   if (this.filterCommon['salary1'] && salary < this.filterCommon['salary1']) {
    //     this.isResetSalaryTo = true;
    //     this.filterCommon['salary2'] = null;
    //   }
    //   else {
    //     this.filterCommon = { ...this.filterCommon, [field]: salary };
    //   }
    // }
    this.filterCommon = { ...this.filterCommon, [field]: salary };
    this.filterMain();
  };

  filterBySalary = (salary, field) => {
    console.log(3);

    const filter = of(salary);
    filter.pipe(distinctUntilChanged(), debounceTime(200)).subscribe((sal) => {
      this.isResetSalaryFrom = false;
      this.isResetSalaryTo = false;
      this.checkValidRangeNumber(field, sal);
    });
  };

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

  private getDetailCompany = async (name: string) => {
    const res = await this.matchingCompanyService.getCompanyProfileByName(name);
    const ret = [];
    if (res.status === RESULT_STATUS.OK) {
      if ((res?.data || []).length !== 0) {
        this.company_keys = res.data.map((m) => m?._key);
        res.data.forEach((item: CompanyInfoDto) => {
          const dto: any = {};
          dto.occupation = item?.occupation?.value;
          dto.fax = item.fax;
          dto.address = item.address;
          dto.phone = item.phone;
          dto.work = item?.work?.value;
          ret.push(dto);
        });
      }
    }
    return ret;
  };

  getTitle = (name: string) => this.translateService.translate(name);

  handleClickViewMore = () => {
    if (this.isShowViewBtn) {
      this.router.navigate(['/company-detail/'], {
        queryParams: {
          id: this.company_keys.join(','),
        },
      });
    }
  };

  addCompany = (company: any, isSync = false) => {
    this.companyName = company?.value;
    this.company_key = company?._key;
    this.isExpan = false;
    if (!isSync) {
      this.filterCommonAppended = {};
      this.filterCommon = {};
    }
    this.removeSearch();

    this.setSkeleton(true);

    // //save keyword to localstorage
    localStorage.setItem(
      StorageKey.KEYWORD + `_${this.user_id}`,
      JSON.stringify({ ...company })
    );
    if (this.company_key) {
      this.getDetailCompany(company?.value).then((r: CompanyInfoDto[]) => {
        if (r.length === 0) {
          this.isShowViewBtn = false;
        }
        const res = {};
        const obj = {
          address: [],
          fax: [],
          occupation: [],
          phone: [],
          work: [],
        };
        (r || []).forEach((dataa) => {
          Object.entries(dataa).forEach(([key, value]) => {
            if (value && !obj[key].includes(value)) {
              obj[key] = [...obj[key], value];
            }
          });
        });
        Object.entries(obj).forEach(
          ([key, value]) => (res[key] = (value || []).join(this.comma))
        );
        // res = { ...res, ...obj };
        this.companySelect = [res];
        this.dataSuggest = [];
        this.currentSearch = company;
        this.submitSearch();
      });
    } else {
      this.callSearchAll();
    }
  };

  async ngOnInit() {
    this.searchConditionService.find().then((e) => {
      this.searchForm.patchValue(e.data[0]);
    });
    this.callSearchAll();

    // if (keyword?._key) {
    //   this.filterMain();
    // } else {
    // }

    // call api # master data
    // this.inputControlMaster.valueChanges
    //   .pipe(
    //     debounceTime(100),
    //     distinctUntilChanged()
    //     // tslint:disable-next-line: deprecation
    //   )
    //   .subscribe((text) => {
    //     this.messageSearch = '';
    //     if (text) {
    //       this.matchingCompanyService.searchCompany(text).then((r) => {
    //         if (r.status === RESULT_STATUS.OK) {
    //           const target = r?.data;
    //           if (target.length !== 0) {
    //             this.dataSuggestAll = target;
    //             this.dataSuggest = AitAppUtils.getUniqueArray(
    //               target || [],
    //               'value'
    //             );
    //           } else {
    //             this.dataSuggestAll = [];
    //             this.dataSuggest = [];
    //             this.messageSearch = 'データがありません。';
    //           }
    //         }
    //       });
    //     } else {
    //       this.dataSuggestAll = [];
    //       this.dataSuggest = [];
    //     }
    //   });
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
    this.company_key = null;
    // this.matchingCompany(null).then(() => {
    // this.getDataByRound().then(() => {
    //   this.setSkeleton(false);
    // });
    // });

    this.getDataByRound().then(() => {
      this.setSkeleton(false);
    });
  }

  loadNext = (event) => {
    if (
      (this.companySelect.length !== 0 && this.cardSkeleton.length === 0) ||
      this.dataFilter.length !== 0
    ) {
      // const startPos = event.target.scrollTop;
      const pos =
        (event.target.scrollTop || document.body.scrollTop) +
        document.documentElement.offsetHeight;
      const max = event.target.scrollHeight;
      // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
      if (pos >= max) {
        if (!this.spinnerLoading) {
          // Coding something 😋😋😋

          if (this.currentTab === 'R' && this.textDataEnd === '') {
            if (this.dataIncludesId.length >= 8) {
              this.setSkeleton(true);
              // this.spinnerLoading = true;

              this.getDataByRound().then(() => {
                // this.filterMain();
              });
            } else {
              this.textDataEnd = '022';
              // setTimeout(() => {
              // this.setSkeleton(false);

              // }, 1000)
            }
          } else {
            if (this.dataIncludesIdSave.length >= 8) {
              // this.spinnerLoading = true;
              this.setSkeleton(true);
              this.getDataByRoundSave()
                .then(() => {
                  // this.filterMain();
                })
                .finally(() => {
                  this.setSkeleton(false);
                });
            } else {
              this.textDataEnd = '022';
              // setTimeout(() => {
              //   this.setSkeleton(false);

              // }, 1000)
            }
          }
          // this.spinnerLoading = false;
        }
      }
    }
  };

  getPlaceHolder = () =>
    !this.isObjectEmpty(this.currentSearch)
      ? ''
      : this.getTitlePlaceholderSearch();
  getTitleSearchBtn = () => this.translateService.translate('002');
  getTitleSaveBtn = () => this.translateService.translate('save');

  getTitlePlaceholderSearch = () => this.translateService.translate('001');

  handleInput = (value) => {
    this.addressSearch = value;
  };

  // Highlight name option when user type
  highlightName = (name) => {
    if (/[a-zA-Z0-9]/.test(name)) {
      const res = name.replace(
        new RegExp(this.addressSearch.trim(), 'gmi'),
        (match) => {
          return `<b class="hightlighted" style="background:yellow">${match}</b>`;
        }
      );

      return res;
    }
    return name;
  };

  // Get Data by round and base on all of result
  getDataByRound = async () => {
    if (this.currentRound !== this.round) {
      this.currentRound = this.round;
      // return data by round
      const detail = await this.getDetailMatching();
      console.log(detail);
      this.dataFilter = detail;
      if (detail.length === 0 && this.dataFilter.length !== 0) {
        this.textDataNull = '';
        this.textDataNullSave = '';
        this.textDataEnd = '022';
        this.setSkeleton(false);
      }
      return;
      if (this.dataFilter.length < this.dataIncludesId.length) {
        this.textDataNull = '';
        this.textDataNullSave = '';
        if (detail.length !== 0) {
          // push total score to detail

          const uq = AitAppUtils.getUniqueArray(
            [...this.dataFilter, ...(detail || [])],
            '_key'
          ).filter((f) => f?.user_id);
          let data = [];
          if (this.company_key) {
            data = uq.map((d) => ({
              ...d,
              total_score: this.dataIncludesId.find(
                (f) => f.value === d.user_id
              )?.total_score,
              group_no: this.dataIncludesId.find((f) => f.value === d.user_id)
                ?.group_no,
              // current_salary: 100000,
              // salary : 1000000
            }));
          } else {
            data = uq.map((d) => ({
              ...d,
              total_score: this.dataIncludesId.find(
                (f) => f.value === d.user_id
              )?.total_score,
              group_no: 3,
              // current_salary: 100000,
              // salary : 1000000
            }));
            // Sort
            const itemStamped = data.filter((f) => f?.stamp > 0);
            const itemStamped1 = itemStamped.filter((f) => f.stamp === 1);
            const itemStamped3 = itemStamped.filter((f) => f.stamp === 2);

            const itemPeriodNotAllowed = data.filter((f) => f?.stamp === 0);

            // Sort by stage
            const sort1 = itemStamped1.sort(
              (a, b) => b.stay_period - a.stay_period
            );
            const sort2 = itemStamped3.sort(
              (a, b) => b.stay_period - a.stay_period
            );
            const sort3 = itemPeriodNotAllowed.sort(
              (a, b) => b.change_at - a.change_at
            );
            data = [...sort1, ...sort2, ...sort3];
          }

          this.dataFilter = data || this.dataFilterDf;
          this.dataFilterDf = data || this.dataFilterDf;

          if (!AitAppUtils.isObjectEmpty(this.filterCommon)) {
            this.filterMain();
          }

          this.setSkeleton(false);
          if (this.dataFilter.length === 0) {
            this.textDataNull = '021';
          }
          this.round++;
        }
      } else {
        this.textDataEnd = '022';
        this.setSkeleton(false);
      }
    }
    this.isSearchButton = false;
  };

  handleClickButton = () => {
    const target = this.currentSearch;
    // this.removeSearch(true);
    this.addCompany(target);
  };

  // Get Data by round and base on all of result
  getDataByRoundSave = async (take = 8) => {
    // return data by round

    const from = 0 + take * (this.round - 1);
    const to = this.round * take;
    const ids = this.dataIncludesIdSave.map((m) => m?.value).slice(from, to); // value is user_profile key
    const detail = await this.getDetailMatching();

    if (detail.length === 0) {
      this.textDataNull = '';
      this.textDataNullSave = '';
      this.textDataEnd = '022';
      this.setSkeleton(false);
    } else {
      // push total score to detail
      const uq = AitAppUtils.getUniqueArray(
        [...this.dataFilterSave, ...(detail || [])],
        '_key'
      ).filter((f) => f?.user_id);
      if (uq.length === 0) {
        this.textDataNullSave = '021';
      }
      let data = [];
      if (this.company_key) {
        data = uq.map((d) => ({
          ...d,
          total_score: this.dataIncludesIdSave.find(
            (f) => f.value === d.user_id
          )?.total_score,
          group_no: this.dataIncludesIdSave.find((f) => f.value === d.user_id)
            ?.group_no,
        }));

        data = (data || []).sort(
          (a, b) => (a.group_no || 99) - (b.group_no || 99)
        );
      } else {
        data = uq.map((d) => ({
          ...d,
          total_score: this.dataIncludesId.find((f) => f.value === d.user_id)
            ?.total_score,
          group_no: 3,
          // current_salary: 100000,
          // salary : 1000000
        }));
        // Sort
        const itemStamped = data.filter((f) => f?.stamp > 0);
        const itemStamped1 = itemStamped.filter((f) => f.stamp === 1);
        const itemStamped3 = itemStamped.filter((f) => f.stamp === 2);

        const itemPeriodNotAllowed = data.filter((f) => f?.stamp === 0);

        // Sort by stage
        const sort1 = itemStamped1.sort(
          (a, b) => b.stay_period - a.stay_period
        );
        const sort2 = itemStamped3.sort(
          (a, b) => b.stay_period - a.stay_period
        );
        const sort3 = itemPeriodNotAllowed.sort(
          (a, b) => b.change_at - a.change_at
        );
        data = [...sort1, ...sort2, ...sort3];
      }

      this.dataFilterSave = data || this.dataFilterSave;
      this.dataFilterSaveDf = data || this.dataFilterSaveDf;
      this.round++;
      // this.setSkeleton(false);
      if (!AitAppUtils.isObjectEmpty(this.filterCommon)) {
        this.filterMain();
      }
      this.setSkeleton(false);
    }
  };

  sortByGroup = (data: any[]) => {
    if (!data) {
      return [];
    }
    return data.sort((d1, d2) => d1?.group_no - d2.group_no);
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

    this.isLoading = true;
    this.resetRound();

    this.currentTab = tab.value;
    if (this.currentTab !== 'R') {
      this.setSkeleton(true);
      this.matchingCompanyService
        .getDataTabSave(this.company_key || this.company)
        .then((r) => {
          console.log(1);

          if (r.status === RESULT_STATUS.OK) {
            if (r.data && r.data.length !== 0) {
              const _keys = (r.data || [])
                .map((d) => d?.vertex?.user_profile?.user_id)
                .filter((x) => !!x);
              if (_keys.length !== 0) {
                this.matchingCompanyService
                  .matchingCompany2(this.company_key || this.company, _keys)
                  .then((r) => {
                    console.log(2);

                    if (r.status === RESULT_STATUS.OK) {
                      this.dataIncludesIdSave = r.data || [];

                      if (this.dataIncludesIdSave.length !== 0) {
                        this.getDataByRoundSave(8).then(() => {
                          // this.isLoading = false;
                          // this.setSkeleton(false);
                        });
                      } else {
                        this.setSkeleton(false);
                        this.textDataNullSave = '021';
                      }
                    }
                  });
              } else {
                this.setSkeleton(false);
                this.textDataNullSave = '021';
              }
            } else {
              this.setSkeleton(false);
              this.textDataNullSave = '021';
            }
          }
        });
    } else {
      this.setSkeleton(true);
      this.submitSearch();
      this.isLoading = false;
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
    this.searchConditionService.save(data).then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        this.searchForm.controls['_key'].setValue(res.data[0]?._key || '');
      }
    });
  }
}
