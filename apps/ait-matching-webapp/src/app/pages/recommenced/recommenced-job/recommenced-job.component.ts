import { CompanyInfoDto, hasLength, isArrayFull, isObjectFull, RESULT_STATUS } from '@ait/shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NbLayoutScrollService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitMasterDataService,
  AitTranslationService,
  AppState,
  MODULES,
  PAGES,
  TabView,
} from '@ait/ui';
import { RecommencedUserService } from '../../../services/recommenced-user.service';
import { ReactionService } from '../../../services/reaction.service';
import { Apollo } from 'apollo-angular';
import { StoreKeywordsSearch } from '../../../state/actions';
import { UserProfileService } from '../../../services/user-profile.service';
import { RecommencedJobService } from '../../../services/recommen/recommenced-job.service';
import { RECOMMENCED_JOB_CODE_CAPTIONS } from './captions';

export enum StorageKey {
  KEYWORD = 'keyword',
  FILTER = 'filter',
}

@Component({
  selector: 'ait-recommenced-user',
  styleUrls: ['./recommenced-job.component.scss'],
  templateUrl: './recommenced-job.component.html',
})
export class RecommencedJobComponent extends AitBaseComponent implements OnInit {
  isNavigate = false;
  currentKeyword = {};
  currentCondition = {};
  master_data_fields = ['prefecture', 'job_business', 'residence_status'];
  inputVal = '';
  tabs: TabView[] = [
    {
      title: 'おすすめ',
      tabIcon: 'star',
      type: 'R',
    },
    {
      title: '保存',
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

  dataFilterSave = [];
  dataFilterSaveDf = [];
  dataIncludesIdSave = [];

  messageSearch = '';

  isLoading = true;
  spinnerLoading = false;
  isExpan1 = true;
  round = 1;
  currentSearch: any = {};
  userName = '';
  dataSuggest = [];
  userSelect = [];
  addressSearch = '';
  inputControlMaster: FormControl;
  dataIncludesId = [];
  user_profile_key = '';
  user_request_key = '';
  currentDataCard = [];

  filterCommon: any = {};
  filterCommonAppended: any = {};
  currentRound = 0;
  textDataEnd = '';
  isResetSalaryFrom = false;
  isResetSalaryTo = false;

  disableTab = false;

  constructor(
    layoutScrollService: NbLayoutScrollService,
    private masterDataService: AitMasterDataService,
    private matchingCompanyService: RecommencedUserService,
    private reactionService: ReactionService,
    private translateService: AitTranslationService,
    private userProfileService: UserProfileService,
    private formBuilder: FormBuilder,
    private recommencedJobService: RecommencedJobService,
    store: Store<AppState>,
    authService: AitAuthService,
    router: Router,
    env: AitEnvironmentService,
    apollo: Apollo
  ) {
    super(store, authService, apollo, null, env, layoutScrollService, null, null, router);

    this.userProfileService.finProfileByUserId(this.user_id).then((res) => {
      if (res.status === RESULT_STATUS.OK && res.data.length == 0) {
        this.router.navigate([`user-onboarding`]);
      }
    });

    this.setModulePage({
      page: PAGES.RECOMMENCED_JOB,
      module: MODULES.RECOMMENCED_JOB,
    });

    // tslint:disable-next-line: deprecation
    layoutScrollService.onScroll().subscribe((e) => {
      const path = AitAppUtils.getParamsOnUrl(true);

      if (path.includes('user-jobs')) {
        this.loadNext(e);
      }
    });
    this.inputControlMaster = new FormControl('');
  }

  ngOnInit() {
    for(let i = 0; i < 20; i++){
      const a =  { 
        _key: 'a'+i, 
        name: 'thuan' + i, 
        name_kana: 'thuan ' + i, 
        work: { _key: 'e1', value: 'Develop' }, 
        prefecture:  [{ _key: 'e1', value: 'Develop'}], 
        company_business: { _key: 'e1', value: 'Develop' },
        job_business: [{ _key: 'e1', value: 'Develop'}],
        salary: '10',
        description: 'thuan test ok',
        business: [{ _key: 'e1', value: 'Develop'}]
      }
      this.dataFilter.push(a);
    }  

    const keyword: any = JSON.parse(
      localStorage.getItem(StorageKey.KEYWORD + `_${this.user_id}_job`)
    );

    if (keyword?._key) {
      this.addUser(keyword, true);
      this.filterMain();
    } else {
      this.callSearchAll();
    }
    // call api # master data
    this.inputControlMaster.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged()
        // tslint:disable-next-line: deprecation
      )
      .subscribe((text) => {
        this.recommencedJobService.searchUser(text).then((r) => {
          if (r.status === RESULT_STATUS.OK) {
            const target = r?.data;
            if (target.length !== 0) {
              this.messageSearch = '';
              this.dataSuggestAll = target;
              this.dataSuggest = AitAppUtils.getUniqueArray(
                target || [],
                'value'
              );
            } else {
              this.dataSuggest = [];
              this.dataSuggestAll = [];
              if (text) {
                this.messageSearch = 'データがありません。';
              }
            }
          }
        });
        if (text === '') {
          this.messageSearch = '';
        }
      });
  }

  private callSearchAll() {
    this.isExpan = true;
    this.user_request_key = null;
    this.matchingUser(null).then((res) => {
      this.getDataByRound().then((r) => {
        // this.isLoading = false;
        this.setSkeleton(false);
      });
    });
  }

  setSkeleton = (flag?: boolean) => {
    if (flag === undefined) {
      this.cardSkeleton = Array(this.getNummberMode8(0)).fill(1);
    } else if (this.currentTab === 'R') {
      this.currentDataCard = this.dataFilter;
      if (flag) {
        //
        this.cardSkeleton = Array(
          this.getNummberMode8(this.dataFilter.length)
        ).fill(1);
      } else {
        this.cardSkeleton = [];
        this.dataFilter = this.currentDataCard;
        //
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
      }
    }
  };

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

  // Get Data by round and base on all of result
  getDataByRound = async (take = 8) => {
    if (this.currentRound !== this.round) {
      this.currentRound = this.round;
      // return data by round
      const from = 0 + take * (this.round - 1);
      const to = this.round * take;
      if (this.dataFilter.length <= this.dataIncludesId.length) {
        const ids = this.dataIncludesId
          .map((d) => d.value)
          .slice(from, to)
          .filter((x) => !!x); // value is user_profile key
        const detail = await this.getDetailMatching(ids);

        if (detail.length === 0 && this.dataFilter.length !== 0) {
          this.textDataNull = '';
          this.textDataNullSave = '';
          this.textDataEnd = '022';
          this.setSkeleton(false);
        } else {
          this.textDataNull = '';
          this.textDataNullSave = '';
          const uq = AitAppUtils.getUniqueArray(
            [...this.dataFilter, ...(detail || [])],
            '_key'
          ).filter((f) => f?._key);

          let data = [];

          if (this.user_request_key) {
            data = uq.map((d) => ({
              ...d,
              total_score: this.dataIncludesId.find((f) => f.value === d._key)
                ?.total_score,
              group_no: this.dataIncludesId.find((f) => f.value === d._key)
                ?.group_no,
              // current_salary: 100000,
              // salary : 1000000
            }));
          } else {
            data = uq.map((d) => ({
              ...d,
              total_score: this.dataIncludesId.find((f) => f.value === d._key)
                ?.total_score,
              group_no: 3,
              // current_salary: 100000,
              // salary : 1000000
            }));
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
      }
    }
  };

  private getDetailMatching = async (list_ids: string[]) => {
    const res = await this.recommencedJobService.getDetailMatching(
      this.user_request_key || this.company || null,
      list_ids
    );
    if (res.status === RESULT_STATUS.OK) {
      if (res.data?.length === 0) {
        this.textDataNull = '021';
      }
      return res.data;
    }
  };

  private matchingUser = async (_key: string) => {
    const filter = this.filterCommon;
    const res = await this.recommencedJobService.matchingUser(_key);

    if (res.status === RESULT_STATUS.OK) {
      //(res?.data || []).sort((a, b) => b.total_score - a.total_score);
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

  loadNext = (event) => {
    if (
      (this.userSelect.length == 0 && this.cardSkeleton.length !== 0) ||
      this.dataFilter.length === 0
    ) {
      const startPos = event.target.scrollTop;
      const pos =
        (event.target.scrollTop || document.body.scrollTop) +
        document.documentElement.offsetHeight;
      const max = event.target.scrollHeight;
      // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
      if (pos <= max) {
        if (!this.spinnerLoading) {
          // Coding something 😋😋😋
          if (this.currentTab === 'R' && this.textDataEnd === '') {
            if (this.dataIncludesId.length >= 8) {
              this.setSkeleton(true);
              // this.spinnerLoading = true;

              this.getDataByRound().then((r) => {
                // this.filterMain();
              });
            } else {
              this.textDataEnd = '022';
              
            }
          } else {
            this.setSkeleton(true);
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

  addUser = (user: any, isSync = false) => {
    this.userName = user?.value;
    this.user_profile_key = user?._key;
    this.isExpan = false;
    if (!isSync) {
      this.filterCommonAppended = {};
      this.filterCommon = {};
    }
    this.removeSearch();

    this.setSkeleton(true);
    localStorage.setItem(
      StorageKey.KEYWORD + `_${this.user_id}_job`,
      JSON.stringify({ ...user })
    );

    if (this.user_profile_key) {
      this.getDetailUser(user?.user_id).then((r) => {
        this.userSelect = r;
        this.dataSuggest = [];
        this.currentSearch = user;
        this.user_request_key = user?.user_key;
        this.submitSearch();
      });
    } else {
      this.callSearchAll();
    }
  };

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
    localStorage.setItem(StorageKey.KEYWORD + `_${this.user_id}_job`, null);
    localStorage.setItem(StorageKey.FILTER + `_${this.user_id}_job`, null);

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

  private getDetailUser = async (userid: string) => {
    const res = await this.recommencedJobService.getUserProfile(userid);
    const ret = [];
    if (res.status === RESULT_STATUS.OK) {
      if ((res?.data || []).length !== 0) {
        res.data.forEach((item) => {
          const dto: any = {};
          dto._key = item?._key;
          dto.address = item?.address;
          dto.dob = item?.dob;
          dto.gender = item?.gender?.value;
          dto.passport_number = item?.passport_number;
          dto.country = item?.country?.value;
          dto.user_key = item?.user_id;
          dto.job_company = item?.job_company;
          ret.push(dto);
        });
      }
    }
    return ret;
  };
  resetRound = () => (this.round = 1);
  submitSearch = (key?: string) => {
    this.isLoading = true;
   
    this.matchingUser(key || this.user_request_key || null).then((m) => {
      this.getDataByRound().then((r) => {
        // this.isLoading = false;
        // this.setSkeleton(false);
      });
    });
  };

  filterMain = () => {
    const condition = {};
    const result = this.dataFilterDf.filter((f) => {
      let check = [];

      Object.entries(this.filterCommon).forEach(([key, value]) => {
        //mannq change
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
              check = [...check, f[key].includes(value)];
            }
          } else {
            //Truong hop co cả 2 salary
            //                          110000        <= x <= 180000
            //salary_from(nhập từ màn hình) - 30.000 <= desired_salary <= salary_to(nhập từ màn hình) + 30.000
            if (this.filterCommon['salary1'] && this.filterCommon['salary2']) {
              if (!f?.salary) {
                check = [...check, false];
              } else {
                const match =
                  (f?.salary || 0) >=
                    this.acceptedSalary(this.filterCommon['salary1'], true) &&
                  (f?.salary || 0) <=
                    this.acceptedSalary(this.filterCommon['salary2']);
                check = [...check, match];
              }
            }
            // Truong hop chi co salary 1 salary_from (nhập từ màn hình) - 30.000 <= desired_salary
            else if (this.filterCommon['salary1']) {
              if (!f?.salary) {
                check = [...check, false];
              } else {
                const match2 =
                  (f?.salary || 0) >=
                  this.acceptedSalary(this.filterCommon['salary1'], true);
                check = [...check, match2];
              }

              // Truong hop chi co salary 2 desired_salary <= salary_to (nhập từ màn hình) + 30.000
            } else if (this.filterCommon['salary2']) {
              if (!f?.salary) {
                check = [...check, false];
              } else {
                const match3 =
                  (f?.salary || 0) <=
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

    this.dataFilter = AitAppUtils.getUniqueArray(
      this.sortByGroup(result),
      '_key'
    );
    this.dataFilterSave = AitAppUtils.getUniqueArray(
      this.sortByGroup(result),
      '_key'
    );
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
      StorageKey.FILTER + `_${this.user_id}_job`,
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
  sortByGroup = (data: any[]) => {
    if (!data) {
      return [];
    }
    return data.sort((d1, d2) => d1?.group_no - d2.group_no);
  };

  isObjectEmpty = (obj) => Object.keys(obj || {}).length === 0;
  getPlaceHolder = () =>
  !this.isObjectEmpty(this.currentSearch)
    ? ''
    : this.getTitlePlaceholderSearch();

    getTitlePlaceholderSearch = () =>
    this.translateService.translate(
      RECOMMENCED_JOB_CODE_CAPTIONS.PLACEHOLDER_SEARCH_BAR
    );
    handleInput = (value) => {
      this.addressSearch = value;
    };

    handleClickButton = () => {
      const target = this.currentSearch;
      // this.removeSearch(true);
      this.addUser(target);
    };

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
        this.recommencedJobService
          .getDataTabSave(this.user_request_key || this.company)
          .then((r) => {
            if (r.status === RESULT_STATUS.OK) {
              if (r.data && r.data.length !== 0) {
                const _keys = (r.data || [])
                  .map((d) => d?.vertex?._key)
                  .filter((x) => !!x);
                if (_keys.length !== 0) {
                  this.recommencedJobService
                    .matchingUser(this.user_request_key || this.company, _keys)
                    .then((r) => {
                      if (r.status === RESULT_STATUS.OK) {
                        this.dataIncludesIdSave = r.data || [];
                        if (this.dataIncludesIdSave.length !== 0) {
                          this.getDataByRoundSave().then((r) => {
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
    getDataByRoundSave = async (take = 8) => {
      // return data by round
  
      const from = 0 + take * (this.round - 1);
      const to = this.round * take;
      const ids = this.dataIncludesIdSave.map((m) => m?.value).slice(from, to); // value is user_profile key
      const detail = await this.getDetailMatching(ids);
  
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
        ).filter((f) => f?._key);
        if (uq.length === 0) {
          this.textDataNullSave = '021';
        }
        const data = uq.map((d) => ({
          ...d,
          total_score: this.dataIncludesIdSave.find((f) => f.value === d._key)
            ?.total_score,
          group_no: this.dataIncludesIdSave.find((f) => f.value === d._key)
            ?.group_no,
        }));
  
        const target = (data || []).sort(
          (a, b) => (a.group_no || 99) - (b.group_no || 99)
        );
  
        this.dataFilterSave = target || this.dataFilterSave;
        this.dataFilterSaveDf = target || this.dataFilterSaveDf;
        this.round++;
        // this.setSkeleton(false);
        if (!AitAppUtils.isObjectEmpty(this.filterCommon)) {
          this.filterMain();
        }
        this.setSkeleton(false);
      }
    };
}
