import { CompanyInfoDto, isObjectFull, RESULT_STATUS } from '@ait/shared';
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
} from '@ait/ui';
import { RecommencedUserService } from '../../../services/recommenced-user.service';
import { ReactionService } from '../../../services/reaction.service';
import { Apollo } from 'apollo-angular';
import { StoreKeywordsSearch } from '../../../state/actions';
import { UserProfileService } from '../../../services/user-profile.service';

export enum StorageKey {
  KEYWORD = 'keyword',
  FILTER = 'filter',
}

@Component({
  selector: 'ait-recommenced-user',
  styleUrls: ['./recommenced-user.component.scss'],
  templateUrl: './recommenced-user.component.html',
})
export class RecommencedComponent extends AitBaseComponent implements OnInit {
  i18nRecomenced = 'common.aureole-v.recommenced-user';
  isNavigate = false;
  currentKeyword = {};
  currentCondition = {};
  master_data_fields = [
    'gender',
    'occupation',
    'prefecture',
    'residence_status',
    'work',
  ];
  Skills = [
    { _key: 'phython', value: 'python' },
    { _key: 'angular', value: 'angular' },
    { _key: 'Technical Support Engineer', value: 'Technical Support Engineer' },
    { _key: 'code', value: 'code' },
    { _key: 'Test', value: 'Test' },
    { _key: 'java', value: 'java' },
    { _key: 'Automation test', value: 'Automation test' },
  ];
  userSkills: FormGroup;

  constructor(
    layoutScrollService: NbLayoutScrollService,
    private masterDataService: AitMasterDataService,
    private matchingCompanyService: RecommencedUserService,
    private reactionService: ReactionService,
    private translateService: AitTranslationService,
    private userProfileService: UserProfileService,
    private formBuilder: FormBuilder,
    store: Store<AppState>,
    authService: AitAuthService,
    private router: Router,
    env: AitEnvironmentService,
    apollo: Apollo
  ) {
    super(store, authService, apollo, null, env, layoutScrollService);

    this.userSkills = this.formBuilder.group({
      skills: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
    });
    router.events.subscribe((val) => {
      // see also
      if (val instanceof NavigationStart) {
        this.isNavigate = true;
        // this.store.dispatch(
        //   new StoreKeywordsSearch({
        //     _key: this.company_key,
        //     value: this.companyName,
        //     dataAll: this.dataSuggestAll,
        //     filterCondition: this.filterCommon,
        //     user_id: this.user_id
        //   })
        // );
      }
    });

    // this.store.pipe(select(getKeywordSearch)).subscribe((keyword) => {
    //   // // // // // console.log(JSON.stringify(this.currentSearch) !== JSON.stringify(keyword), this.currentSearch, keyword);

    //   if (JSON.stringify(this.currentKeyword) !== JSON.stringify(keyword)) {
    //     this.currentKeyword = keyword;
    //     // // // // console.log(keyword, this.currentKeyword);
    //     if (keyword._key && keyword.dataAll && keyword.value && keyword.user_id === this.user_id) {
    //       this.currentSearch = { _key: keyword._key, value: keyword.value };
    //       this.company_key = keyword?._key;
    //       this.dataSuggestAll = keyword.dataAll;
    //       this.filterCommon = keyword.filterCondition || {};
    //       this.addCompany(this.currentSearch);
    //     }
    //   }
    // });

    this.userProfileService.finProfileByUserId(this.user_id).then((res) => {
      if (res.status === RESULT_STATUS.OK && res.data.length == 0) {
        this.router.navigate([`user-onboarding`]);
      }
    });

    // tslint:disable-next-line: deprecation
    layoutScrollService.onScroll().subscribe((e) => {
      const path = AitAppUtils.getParamsOnUrl(true);

      if (path.includes('recommenced-user')) {
        this.loadNext(e);
      }
    });
    this.inputControlMaster = new FormControl('');
  }

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

  isLoading = true;
  spinnerLoading = false;
  isExpan1 = false;
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
        //
        this.cardSkeleton = Array(
          this.getNummberMode8(this.dataFilter.length)
        ).fill(1);
        // // // // // console.log(this.cardSkeleton, this.getNummberMode8(this.currentDataCard.length));
      } else {
        this.cardSkeleton = [];
        this.dataFilter = this.currentDataCard;
        //
      }
    } else {
      // // // // // console.log(this.dataFilterSave)
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

  removeSearch = () => {
    this.currentSearch = {};
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
  };

  getPlaceHolder = () =>
    !this.isObjectEmpty(this.currentSearch)
      ? ''
      : this.i18nRecomenced + '.search-bar.placeholder';
  goTop = () => {
    this.gotoTop();
  };

  private matchingCompany = async (_key: string) => {
    // // console.log(this.filterCommon);
    const filter = this.filterCommon;
    const res = await this.matchingCompanyService.matchingCompany(_key);

    if (res.status === RESULT_STATUS.OK) {
      //(res?.data || []).sort((a, b) => b.total_score - a.total_score);
      const data = res.data;
      // // console.log(data);

      if (data && data?.length !== 0) {
        const sort_by_group = data.sort((a, b) => -b.group_no + a.group_no);
        const obj = {
          group1: sort_by_group.filter((f) => f.group_no === 1),
          group2: sort_by_group.filter((f) => f.group_no === 2),
          group3: sort_by_group.filter((f) => !f.group_no || f.group_no === 3),
        };

        const sort = {
          sort1: obj.group1.sort((a, b) => b.total_score - a.total_score),
          sort2: obj.group2.sort((a, b) => b.total_score - a.total_score),
          sort3: obj.group3.sort(
            (a, b) => (b?.total_score || 0) - (a?.total_score || 0)
          ),
        };
        // // // console.log(sort)
        this.dataIncludesId = [...sort.sort1, ...sort.sort2, ...sort.sort3];
        // // // console.log(this.dataIncludesId);
        // // console.log(filter)
        this.filterCommon = filter;
      } else {
        this.setSkeleton(false);
        this.textDataNull = this.i18nRecomenced + '.result.text-data-null';
      }
    }
  };

  private getDetailMatching = async (list_ids: string[]) => {
    const res = await this.matchingCompanyService.getDetailMatching(
      this.company_key,
      list_ids
    );
    if (res.status === RESULT_STATUS.OK) {
      // // // // // console.log(res.data);
      if (res.data?.length === 0) {
        this.textDataNull = this.i18nRecomenced + '.result.text-data-null';
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
    // // // // // console.log('a1')
    this.isExpan1 = !this.isExpan1;
  };

  submitSearch = () => {
    // // // // console.log('submit')
    this.isLoading = true;
    // this.setSkeleton(true);

    this.matchingCompany(this.company_key).then((m) => {
      // console.log(this.filterCommon);
      this.getDataByRound().then((r) => {
        // this.isLoading = false;
        // this.setSkeleton(false);
      });
    });
  };

  filterMain = () => {
    // tslint:disable-next-line: no-console

    // const conds = AppUtils.isObjectEmpty(this.filterCommonAppended) ? this.filterCommon : this.filterCommonAppended;
    // // console.log(conds);
    const condition = {};

    Object.entries(this.filterCommon).forEach(([key, value]) => {
      if (value) {
        condition[key] = value;
        if (!key.includes('salary')) {
          const target: any = value;
          this.dataFilter = this.dataFilterDf.filter((f) => {
            if (this.master_data_fields.includes(key)) {
              return f[key] ? f[key]?._key.includes(target) : false;
            }
            return f[key] ? f[key].includes(value) : false;
          });

          this.dataFilterSave = this.dataFilterSaveDf.filter((f) => {
            if (this.master_data_fields.includes(key)) {
              return f[key] ? f[key]?._key.includes(target) : false;
            }
            return f[key] ? f[key].includes(value) : false;
          });
        } else {
          // Truong hop chi co salary 1
          if (this.filterCommon['salary1']) {
            this.dataFilter = this.dataFilterDf.filter(
              (f) =>
                (f?.salary_desired || 0) >=
                this.acceptedSalary(this.filterCommon['salary1'], true)
            );

            this.dataFilterSave = this.dataFilterSaveDf.filter(
              (f) =>
                (f?.salary_desired || 0) >=
                this.acceptedSalary(this.filterCommon['salary1'], true)
            );

            // Truong hop chi co salary 2
          } else if (this.filterCommon['salary2']) {
            this.dataFilter = this.dataFilterDf.filter(
              (f) =>
                (f?.salary_desired || 0) <=
                this.acceptedSalary(this.filterCommon['salary2'])
            );

            this.dataFilterSave = this.dataFilterSaveDf.filter(
              (f) =>
                (f?.salary_desired || 0) <=
                this.acceptedSalary(this.filterCommon['salary2'])
            );

            //Truong hop co car 2 salary
          }
          if (this.filterCommon['salary1'] && this.filterCommon['salary2']) {
            this.dataFilter = this.dataFilterDf.filter(
              (f) =>
                (f?.salary_desired || 0) >=
                  this.acceptedSalary(this.filterCommon['salary1'], true) &&
                (f?.salary_desired || 0) <=
                  this.acceptedSalary(this.filterCommon['salary2'])
            );

            this.dataFilterSave = this.dataFilterSaveDf.filter(
              (f) =>
                (f?.salary_desired || 0) >=
                  this.acceptedSalary(this.filterCommon['salary1'], true) &&
                (f?.salary_desired || 0) <=
                  this.acceptedSalary(this.filterCommon['salary2'])
            );
          }
        }
      }
    });
    this.currentCondition = condition;

    // console.log(condition);
    // // // // console.log(AppUtils.isObjectEmpty(condition))

    // // // // // console.log(AppUtils.isObjectEmpty(condition))
    if (AitAppUtils.isObjectEmpty(condition)) {
      this.dataFilter = this.dataFilterDf;
      this.dataFilterSave = this.dataFilterSaveDf;
    }

    if (this.dataFilter.length === 0) {
      this.textDataNull = this.i18nRecomenced + '.result.text-data-null';
    }

    if (this.dataFilterSave.length === 0) {
      this.textDataNullSave = this.i18nRecomenced + '.result.text-data-null';
    }

    localStorage.setItem(
      StorageKey.FILTER + `_${this.user_id}`,
      JSON.stringify({ ...this.filterCommon })
    );

    // // // // // console.log(condition, this.dataFilter, this.dataFilterSave);
  };

  acceptedSalary = (salary: number, isFirst?: boolean) => {
    const target = salary || 0;

    return isFirst ? target - 30000 : target + 30000;
  };

  filterRemark = (value) => {
    // // // // // console.log(value)
    const filter = of(value);
    filter.pipe(distinctUntilChanged(), debounceTime(200)).subscribe((text) => {
      // // // // console.log(text);
      this.filterCommon = { ...this.filterCommon, remark: text };
      this.filterMain();
    });
  };

  filterBySalary = (salary, field) => {
    const filter = of(salary);
    filter.pipe(distinctUntilChanged(), debounceTime(200)).subscribe((sal) => {
      this.filterCommon = { ...this.filterCommon, [field]: sal };

      this.filterMain();
    });
  };

  filterPrefecture = (val) => {
    // // console.log(val)
    const value = val?.value || [];
    const target = value[0]?._key;
    this.filterCommon = { ...this.filterCommon, prefecture: target };
    this.filterMain();
  };

  filterByGender = (val) => {
    // console.log(val);
    const value = val?.value || [];
    const target = value[0]?._key;
    this.filterCommon = { ...this.filterCommon, gender: target };
    this.filterMain();
  };

  filterByOccupation = (val) => {
    // // console.log(val);

    const value = val?.value || [];
    const target = value[0]?._key;
    // // // console.log(target);
    this.filterCommon = { ...this.filterCommon, occupation: target };

    this.filterMain();
  };

  private getDetailCompany = async (name: string) => {
    const res = await this.matchingCompanyService.getCompanyProfileByName(name);
    const ret = [];
    if (res.status === RESULT_STATUS.OK) {
      if ((res?.data || []).length !== 0) {
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
    // // // // console.log(ret)
    return ret;
  };

  handleClickViewMore = () => {
    this.router.navigateByUrl('/company/' + this.companyName);
  };

  addCompany = (company: any) => {
    this.setSkeleton(true);

    // //save keyword to localstorage
    localStorage.setItem(
      StorageKey.KEYWORD + `_${this.user_id}`,
      JSON.stringify({ ...company })
    );

    // // const getDataFromCompanyValue = this.dataSuggestAll.filter(f => f?.value === company?.value).map(m => m._key);
    // // // // // // console.log(getDataFromCompanyValue);
    this.getDetailCompany(company?.value).then((r: CompanyInfoDto[]) => {
      // // // // // console.log(r)
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
            // // // // // console.log(key, obj[key]);
          }
        });
      });
      const comma = this.translateService.translate('common.system.key.comma');
      Object.entries(obj).forEach(
        ([key, value]) => (res[key] = (value || []).join(comma))
      );
      // res = { ...res, ...obj };
      // // // // // console.log(res)
      this.companySelect = [res];
      this.dataSuggest = [];
      this.currentSearch = company;
      this.companyName = company?.value;
      this.company_key = company?._key;
      this.submitSearch();
    });
  };

  // getValue = (v) => console.log(v);

  ngOnInit() {
    const keyword: any = JSON.parse(
      localStorage.getItem(StorageKey.KEYWORD + `_${this.user_id}`)
    );
    const filter = localStorage.getItem(StorageKey.FILTER + `_${this.user_id}`)
      ? JSON.parse(localStorage.getItem(StorageKey.FILTER + `_${this.user_id}`))
      : {};
    // console.log(this.user_id, this.authService.getUserID())
    if (keyword?._key) {
      this.filterCommon = filter;
      this.filterCommonAppended = filter;
      this.addCompany(keyword);

      this.filterMain();
    }
    // call api # master data
    this.inputControlMaster.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged()
        // tslint:disable-next-line: deprecation
      )
      .subscribe((text) => {
        // // // // // console.log(text)
        if (text) {
          // // // // // console.log(text)
          this.masterDataService
            .getSuggestData({
              type: 'COMPANY',
              keyword: text,
            })
            .then((r) => {
              // // // // // console.log(r);
              this.dataSuggestAll = r?.data;
              this.dataSuggest = AitAppUtils.getUniqueArray(
                (r?.data || []).slice(0, 25),
                'value'
              );

              // this.filteredOptions$ = of(this.dataSource);
            });
        } else {
          this.dataSuggest = [];
        }
      });
  }

  loadNext = (event) => {
    // // // // // console.log('Load next')

    if (this.companySelect.length !== 0 && this.cardSkeleton.length === 0) {
      const startPos = event.target.scrollTop;
      const pos =
        (event.target.scrollTop || document.body.scrollTop) +
        document.documentElement.offsetHeight;
      const max = event.target.scrollHeight;
      // // // // // console.log(pos, max, startPos)
      // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
      if (pos === max) {
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
              this.textDataEnd = this.i18nRecomenced + '.result.text-data-end';
              // setTimeout(() => {
              //   // this.setSkeleton(false);

              // }, 1000)
            }
          } else {
            if (this.dataIncludesIdSave.length >= 8) {
              // this.spinnerLoading = true;
              this.setSkeleton(true);
              this.getDataByRoundSave().then((r) => {
                // this.filterMain();
              });
            } else {
              this.textDataEnd = this.i18nRecomenced + '.result.text-data-end';
              // setTimeout(() => {
              //   this.setSkeleton(false);

              // }, 1000)
            }
          }
          // this.spinnerLoading = false;
        }
      }

      if (startPos !== 0) {
      }
    }
  };

  handleInput = (value) => {
    this.addressSearch = value;
  };

  // Highlight name option when user type
  highlightName = (name) => {
    // // // // // console.log(this.addressSearch);
    const res = name.replace(
      new RegExp(this.addressSearch.trim(), 'gmi'),
      (match) => {
        // // // // // console.log(match)
        return `<b class="hightlighted" style="background:yellow">${match}</b>`;
      }
    );

    return res;
  };

  // Get Data by round and base on all of result
  getDataByRound = async (take = 8) => {
    // // // // console.log(this.filterCommon);
    if (this.currentRound !== this.round) {
      this.currentRound = this.round;
      // return data by round
      const from = 0 + take * (this.round - 1);
      const to = this.round * take;
      if (this.dataFilter.length < this.dataIncludesId.length) {
        const ids = this.dataIncludesId
          .map((d) => d.value)
          .slice(from, to)
          .filter((x) => !!x); // value is user_profile key
        // // // console.log(this.dataIncludesId)
        const detail = await this.getDetailMatching(ids);

        // push total score to detail

        const uq = AitAppUtils.getUniqueArray(
          [...this.dataFilter, ...(detail || [])],
          '_key'
        ).filter((f) => f?.user_id);
        if (uq.length === 0) {
          this.textDataNull = this.i18nRecomenced + '.result.text-data-null';
        }
        const data = uq.map((d) => ({
          ...d,
          total_score: this.dataIncludesId.find((f) => f.value === d.user_id)
            ?.total_score,
          group_no: this.dataIncludesId.find((f) => f.value === d.user_id)
            ?.group_no,
          // current_salary: 100000,
          // salary : 1000000
        }));
        this.dataFilter = data || this.dataFilterDf;
        this.dataFilterDf = data || this.dataFilterDf;

        // // // // // console.log(this.filterCommon);
        if (!AitAppUtils.isObjectEmpty(this.filterCommon)) {
          this.filterMain();
        }

        this.setSkeleton(false);
        this.round++;
      }
    }
  };

  // Get Data by round and base on all of result
  getDataByRoundSave = async (take = 8) => {
    // return data by round

    const from = 0 + take * (this.round - 1);
    const to = this.round * take;
    const ids = this.dataIncludesIdSave.map((m) => m?.value).slice(from, to); // value is user_profile key
    // // // // // console.log(ids, from, to, this.dataFilterSave);
    const detail = await this.getDetailMatching(ids);

    // push total score to detail
    const uq = AitAppUtils.getUniqueArray(
      [...this.dataFilterSave, ...(detail || [])],
      '_key'
    ).filter((f) => f?.user_id);
    if (uq.length === 0) {
      this.textDataNullSave = this.i18nRecomenced + '.result.text-data-null';
    }
    // // // // // console.log(uq)
    const data = uq.map((d) => ({
      ...d,
      total_score: this.dataIncludesIdSave.find((f) => f.value === d.user_id)
        ?.total_score,
      group_no: this.dataIncludesIdSave.find((f) => f.value === d.user_id)
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
  };

  // thêm nút scroll to top : TODO

  resetRound = () => (this.round = 1);

  getValue = (value) => {
    console.log(value);
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

    // // // // // console.log(tab);
    this.currentTab = tab.value;
    if (this.currentTab !== 'R') {
      this.setSkeleton(true);
      this.matchingCompanyService.getDataTabSave(this.company_key).then((r) => {
        if (r.status === RESULT_STATUS.OK) {
          if (r.data && r.data.length !== 0) {
            const _keys = (r.data || [])
              .map((d) => d?.vertex?.user_profile?.user_id)
              .filter((x) => !!x);
            // // // // // console.log(_keys)
            if (_keys.length !== 0) {
              this.matchingCompanyService
                .matchingCompany(this.company_key, _keys)
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
                      this.textDataNullSave =
                        this.i18nRecomenced + '.result.text-data-null';
                    }
                  }
                });
            } else {
              this.setSkeleton(false);
              this.textDataNullSave =
                this.i18nRecomenced + '.result.text-data-null';
            }
          } else {
            this.setSkeleton(false);
            this.textDataNullSave =
              this.i18nRecomenced + '.result.text-data-null';
          }
        }
      });
    } else {
      this.setSkeleton(true);
      this.submitSearch();
      this.isLoading = false;
    }
  };

  takeMasterValue(val: any, form: string): void {
    if (val.value.length > 0) {
      if (isObjectFull(val) && val.value.length > 0) {
        const data = [];
        val.value.forEach((item) => {
          data.push(item);
        });
        this.userSkills.controls[form].markAsDirty();
        this.userSkills.controls[form].setValue(data);
      }
    } else {
      this.userSkills.controls[form].markAsDirty();
      this.userSkills.controls[form].setValue(null);
    }

  }
}
