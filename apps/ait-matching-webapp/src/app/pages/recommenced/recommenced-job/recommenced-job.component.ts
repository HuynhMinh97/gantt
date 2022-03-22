// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { hasLength, isArrayFull, RESULT_STATUS } from '@ait/shared';
// import { Component, OnInit } from '@angular/core';
// import { FormControl } from '@angular/forms';
// import { NavigationStart, Router } from '@angular/router';
// import { NbLayoutScrollService,NbToastrService } from '@nebular/theme';
// import { select, Store } from '@ngrx/store';
// import { of } from 'rxjs';

// import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
// import {
//   AitAppUtils,
//   AitAuthService,
//   AitBaseComponent,
//   AitDateFormatService,
//   AitEnvironmentService,
//   AitMasterDataService,
//   AitTranslationService,
//   AppState,
//   MODULES,
//   PAGES,
//   TabView,
// } from '@ait/ui';
// import { Apollo } from 'apollo-angular';
// import { StoreKeywordsSearch } from '../../../state/actions';
// import { ReactionService } from '../../../services/recommen/reaction.service';
// import { RecommencedUserService } from '../../../services/recommen/recommenced-user.service';
// import { RECOMMENCED_JOB_CODE_CAPTIONS } from './captions';
// import { RecommencedJobService } from '../../../services/recommen/recommenced-job.service';

// export enum StorageKey {
//   KEYWORD = 'keyword',
//   FILTER = 'filter',
// }

// @Component({
//   selector: 'ait-recommenced-job',
//   templateUrl: './recommenced-job.component.html',
//   styleUrls: ['./recommenced-job.component.scss']
// })
// export class RecommencedJobComponent
//   extends AitBaseComponent
//   implements OnInit {
//   isNavigate = false;
//   currentKeyword = {};
//   currentCondition = {};
//   master_data_fields = ['prefecture', 'job_business', 'residence_status'];
//   inputVal = '';
//   constructor(
//     router: Router,
//     layoutScrollService: NbLayoutScrollService,
//     private masterDataService: AitMasterDataService,
//     private recommencedJobService: RecommencedJobService,
//     private reactionService: ReactionService,
//     private translateService: AitTranslationService,
//     store: Store<AppState | any>,
//     authService: AitAuthService,
//     env: AitEnvironmentService,
//     apollo: Apollo,
//     private dateFormatService: AitDateFormatService
//   ) {
//     super(
//       store,
//       authService,
//       apollo,
//       null,
//       env,
//       layoutScrollService,
//       null,
//       null,
//       router
//     );

//     // this.setModulePage({
//     //   page: PAGES.RECOMMENCED_JOB,
//     //   module: MODULES.RECOMMENCED_JOB,
//     // });
//     // router.events.subscribe((val) => {
//     //   // see also
//     //   if (val instanceof NavigationStart) {
//     //     this.isNavigate = true;
//     //   }
//     // });

//     // store.pipe(select(this.getCaption)).subscribe(() => {
//     //   const comma = this.translateService.translate('s_0001');
//     //   if (comma !== 's_0001') {
//     //     this.comma = comma;
//       // }
//     // });

//     // tslint:disable-next-line: deprecation
//     layoutScrollService.onScroll().subscribe((e) => {
//       const path = AitAppUtils.getParamsOnUrl(true);

//       if (path.includes('jobs')) {
//         this.loadNext(e);
//       }
//     });
//     this.inputControlMaster = new FormControl('');
//   }

//   tabs: TabView[] = [
//     {
//       title: 'おすすめ',
//       tabIcon: 'star',
//       type: 'R',
//     },
//     {
//       title: '保存',
//       tabIcon: 'bookmark',
//       type: 'S',
//     },
//   ];
//   comma = '、';

//   cardSkeleton = Array(8).fill(1);
//   textDataNull = '';
//   textDataNullSave = '';
//   dataSuggestAll = [];
//   isExpan = false;
//   currentTab = 'R';
//   employeeData = [];
//   dataFilter = [];
//   dataFilterDf = [];

//   dataFilterSave = [];
//   dataFilterSaveDf = [];
//   dataIncludesIdSave = [];

//   messageSearch = '';

//   isLoading = true;
//   spinnerLoading = false;
//   isExpan1 = true;
//   round = 1;
//   currentSearch: any = {};
//   userName = '';
//   dataSuggest = [];
//   userSelect = [];
//   addressSearch = '';
//   inputControlMaster: FormControl;
//   dataIncludesId = [];
//   user_profile_key = '';
//   user_request_key = '';
//   currentDataCard = [];

//   filterCommon: any = {};
//   filterCommonAppended: any = {};
//   currentRound = 0;
//   textDataEnd = '';
//   isResetSalaryFrom = false;
//   isResetSalaryTo = false;

//   disableTab = false;

//   ngOnInit() {
//     debugger
//     console.log('thuan');   
//     const keyword: any = JSON.parse(
//       localStorage.getItem(StorageKey.KEYWORD + `_${this.user_id}_job`)
//     );
   
//     if (keyword?._key) {
    
//       this.addUser(keyword, true);

//       this.filterMain();
//     } else {
//       this.callSearchAll();
//     }
//     // call api # master data
//     this.inputControlMaster.valueChanges
//       .pipe(
//         debounceTime(100),
//         distinctUntilChanged()
//         // tslint:disable-next-line: deprecation
//       )
//       .subscribe((text) => {
//         this.recommencedJobService.searchUser(text).then((r) => {
//           if (r.status === RESULT_STATUS.OK) {
//             const target = r?.data;
//             if (target.length !== 0) {
//               this.messageSearch = '';
//               this.dataSuggestAll = target;
//               this.dataSuggest = AitAppUtils.getUniqueArray(
//                 target || [],
//                 'value'
//               );
//             } else {
//               this.dataSuggest = [];
//               this.dataSuggestAll = [];
//               if (text) {
//                 this.messageSearch = 'データがありません。';
//               }
//             }
//           }
//         });
//         if (text === '') {
//           this.messageSearch = '';
//         }
//       });
//   }

//   getNummberMode8 = (target: number) => {
//     if (target === 0) {
//       return 8;
//     }
//     if (target) {
//       const num = target.toString();
//       const lastString = num[num.length - 1];
//       return 2 * 8 - Number(lastString);
//     }
//     return 0;
//   };

//   setSkeleton = (flag?: boolean) => {
//     if (flag === undefined) {
//       this.cardSkeleton = Array(this.getNummberMode8(0)).fill(1);
//     } else if (this.currentTab === 'R') {
//       this.currentDataCard = this.dataFilter;
//       if (flag) {
//         //
//         this.cardSkeleton = Array(
//           this.getNummberMode8(this.dataFilter.length)
//         ).fill(1);
//       } else {
//         this.cardSkeleton = [];
//         this.dataFilter = this.currentDataCard;
//         //
//       }
//     } else {
//       this.currentDataCard = this.dataFilterSave;
//       if (flag) {
//         //
//         this.cardSkeleton = Array(
//           this.getNummberMode8(this.dataFilterSave.length)
//         ).fill(1);
//       } else {
//         this.cardSkeleton = [];
//         this.dataFilterSave = this.currentDataCard;

//         //
//       }
//     }
//   };

//   isObjectEmpty = (obj) => Object.keys(obj || {}).length === 0;

//   removeSearch = (isPrevented = false, isButton = false) => {
//     // this.filterCommonAppended = {}
//     // this.filterCommon = {};
//     this.dataFilter = [];
//     this.dataIncludesId = [];
//     this.dataIncludesIdSave = [];
//     this.dataFilterSave = [];
//     this.dataFilterSaveDf = [];
//     this.dataFilterDf = [];
//     this.textDataNull = '';
//     this.textDataNullSave = '';
//     this.textDataEnd = '';
//     this.currentRound = 0;
//     this.resetRound();
//     this.inputControlMaster.patchValue('');
//     this.store.dispatch(new StoreKeywordsSearch({}));
//     localStorage.setItem(StorageKey.KEYWORD + `_${this.user_id}_job`, null);
//     localStorage.setItem(StorageKey.FILTER + `_${this.user_id}_job`, null);

//     this.currentTab = 'R';
//     this.disableTab = true;
//     setTimeout(() => {
//       this.disableTab = false;
//     }, 200);

//     if (!isPrevented) {
//       this.currentSearch = {};
//       if (isButton) {
//         this.isExpan = true;
//         this.setSkeleton(true);
//         this.callSearchAll();
//       }
//     } else {
//       this.isExpan = true;
//       this.setSkeleton(true);
//       this.callSearchAll();
//     }
//   };

//   goTop = () => {
//     this.gotoTop();
//   };

//   private matchingUser = async (_key: string) => {
//     const filter = this.filterCommon;
//     const res = await this.recommencedJobService.matchingUser(_key);

//     if (res.status === RESULT_STATUS.OK) {
//       //(res?.data || []).sort((a, b) => b.total_score - a.total_score);
//       const data = res.data;
//       if (data && data?.length !== 0) {
//         this.dataIncludesId = data;
//         this.filterCommon = filter;
//       } else {
//         this.setSkeleton(false);
//         this.textDataNull = '021';
//       }
//     }
//   };

//   private getDetailMatching = async (list_ids: string[]) => {
//     const res = await this.recommencedJobService.getDetailMatching(
//       this.user_request_key || this.company || null,
//       list_ids
//     );
//     if (res.status === RESULT_STATUS.OK) {
//       if (res.data?.length === 0) {
//         this.textDataNull = '021';
//       }
//       return res.data;
//     }
//   };

//   getDataClone = (data) => {
//     return AitAppUtils.deepCloneArray(data || []);
//   };

//   handleSyncData = ($event) => {
//     const { job_key, is_saved } = $event;
//     const find = this.dataFilterDf.find((f) => f._key === job_key);
//     const currentFind = this.dataFilter.find((f) => f._key === job_key);
//     if (find) {
//       find.is_saved = is_saved;
//     }

//     if (currentFind) {
//       currentFind.is_saved = is_saved;
//     }
//   };

//   ToggleExpan = () => (this.isExpan = !this.isExpan);
//   ToggleExpan1 = () => {
//     this.isExpan1 = !this.isExpan1;
//   };

//   submitSearch = (key?: string) => {
//     this.isLoading = true;
//     // this.setSkeleton(true);
//     this.matchingUser(key || this.user_request_key || null).then((m) => {
//       this.getDataByRound().then((r) => {
//         // this.isLoading = false;
//         // this.setSkeleton(false);
//       });
//     });
//   };

//   filterMain = () => {
//     // tslint:disable-next-line: no-console

//     // const conds = AppUtils.isObjectEmpty(this.filterCommonAppended) ? this.filterCommon : this.filterCommonAppended;
//     const condition = {};
//     // let data1 = [];
//     // let data2 = [];

//     const result = this.dataFilterDf.filter((f) => {
//       let check = [];

//       Object.entries(this.filterCommon).forEach(([key, value]) => {
//         //mannq change
//         const isValid = this.checkValidForFilter(value);
//         if (isValid) {
//           condition[key] = value;
//           // if (key.includes('description')) {

//           //   const c = f[key]?.includes(value)
//           //   check = [...check, c];
//           // }
//           if (!key.includes('salary')) {
//             if (this.master_data_fields.includes(key)) {
//               if (isArrayFull(f[key])) {
//                 const map = f[key].map((m) => m?.value);
//                 //mannq change
//                 // check = [...check, map.includes(value)];
//                 check = [
//                   ...check,
//                   map.some((v: string) => ~(value as any[]).indexOf(v)),
//                 ];
//               } else {
//                 //mannq change
//                 // check = [...check, f[key]?._key === value];
//                 check = [...check, (value as any[]).includes(f[key]?._key)];
//               }
//             } else {
//               check = [...check, f[key].includes(value)];
//             }
//           } else {
//             //Truong hop co cả 2 salary
//             //                          110000        <= x <= 180000
//             //salary_from(nhập từ màn hình) - 30.000 <= desired_salary <= salary_to(nhập từ màn hình) + 30.000
//             if (this.filterCommon['salary1'] && this.filterCommon['salary2']) {
//               if (!f?.salary) {
//                 check = [...check, false];
//               } else {
//                 const match =
//                   (f?.salary || 0) >=
//                     this.acceptedSalary(this.filterCommon['salary1'], true) &&
//                   (f?.salary || 0) <=
//                     this.acceptedSalary(this.filterCommon['salary2']);
//                 check = [...check, match];
//               }
//             }
//             // Truong hop chi co salary 1 salary_from (nhập từ màn hình) - 30.000 <= desired_salary
//             else if (this.filterCommon['salary1']) {
//               if (!f?.salary) {
//                 check = [...check, false];
//               } else {
//                 const match2 =
//                   (f?.salary || 0) >=
//                   this.acceptedSalary(this.filterCommon['salary1'], true);
//                 check = [...check, match2];
//               }

//               // Truong hop chi co salary 2 desired_salary <= salary_to (nhập từ màn hình) + 30.000
//             } else if (this.filterCommon['salary2']) {
//               if (!f?.salary) {
//                 check = [...check, false];
//               } else {
//                 const match3 =
//                   (f?.salary || 0) <=
//                   this.acceptedSalary(this.filterCommon['salary2']);
//                 check = [...check, match3];
//               }
//             }
//           }
//         }
//       });

//       return (
//         check.length !== 0 &&
//         !check.includes(false) &&
//         !check.includes(undefined)
//       );
//     });

//     this.dataFilter = AitAppUtils.getUniqueArray(
//       this.sortByGroup(result),
//       '_key'
//     );
//     this.dataFilterSave = AitAppUtils.getUniqueArray(
//       this.sortByGroup(result),
//       '_key'
//     );
//     this.currentCondition = condition;

//     if (AitAppUtils.isObjectEmpty(condition)) {
//       this.dataFilter = this.dataFilterDf;
//       this.dataFilterSave = this.dataFilterSaveDf;
//     }

//     if (this.dataFilter.length === 0) {
//       this.textDataNull = '021';
//     }

//     if (this.dataFilterSave.length === 0) {
//       this.textDataNullSave = '021';
//     }

//     localStorage.setItem(
//       StorageKey.FILTER + `_${this.user_id}_job`,
//       JSON.stringify({ ...this.filterCommon })
//     );
//   };

//   checkValidForFilter(value: any) {
//     if (Array.isArray(value)) {
//       return hasLength(value);
//     } else if (value) {
//       return true;
//     } else {
//       return false;
//     }
//   }

//   acceptedSalary = (salary: number, isFirst?: boolean) => {
//     const target = salary || 0;

//     // return isFirst ? target - 30000 : target + 30000;
//     return target;
//   };

//   filterDescription = (value) => {
//     const filter = of(value);
//     filter.pipe(distinctUntilChanged(), debounceTime(200)).subscribe((text) => {
//       this.filterCommon = { ...this.filterCommon, description: text };
//       this.filterMain();
//     });
//   };

//   sortByGroup = (data: any[]) => {
//     if (!data) {
//       return [];
//     }
//     return data.sort((d1, d2) => d1?.group_no - d2.group_no);
//   };

//   checkValidRangeNumber = (field: string, salary) => {
//     // case reset salary1
//     // if (field === 'salary1') {
//     //   if (this.filterCommon['salary2'] && salary > this.filterCommon['salary2']) {
//     //     this.isResetSalaryFrom = true;
//     //     this.filterCommon['salary1'] = null;
//     //   }
//     //   else {
//     //     this.filterCommon = { ...this.filterCommon, [field]: salary };

//     //   }
//     // }
//     // else {
//     //   if (this.filterCommon['salary1'] && salary < this.filterCommon['salary1']) {
//     //     this.isResetSalaryTo = true;
//     //     this.filterCommon['salary2'] = null;
//     //   }
//     //   else {
//     //     this.filterCommon = { ...this.filterCommon, [field]: salary };
//     //   }
//     // }
//     this.filterCommon = { ...this.filterCommon, [field]: salary };
//     this.filterMain();
//   };

//   filterBySalary = (salary, field) => {
//     const filter = of(salary);
//     filter.pipe(distinctUntilChanged(), debounceTime(200)).subscribe((sal) => {
//       this.isResetSalaryFrom = false;
//       this.isResetSalaryTo = false;
//       this.checkValidRangeNumber(field, sal);
//     });
//   };

//   filterByCondition = (val: any, type: string) => {
//     const value = val?.value || [];
//     const target = this.getValueFromMaster(value);
//     this.filterCommon = { ...this.filterCommon, [type]: target };
//     this.filterMain();
//   };

//   getValueFromMaster(value: any[]) {
//     if (value.length === 0) {
//       return [];
//     } else {
//       const result = [];
//       (value || []).forEach((e) => {
//         if (e?._key) {
//           result.push(e?._key);
//         }
//       });
//       return result;
//     }
//   }

//   private getDetailUser = async (userid: string) => {
//     const res = await this.recommencedJobService.getUserProfile(userid);
//     const ret = [];
//     if (res.status === RESULT_STATUS.OK) {
//       if ((res?.data || []).length !== 0) {
//         res.data.forEach((item) => {
//           const dto: any = {};
//           dto._key = item?._key;
//           dto.address = item?.address;
//           dto.dob = item?.dob;
//           dto.gender = item?.gender?.value;
//           dto.passport_number = item?.passport_number;
//           dto.country = item?.country?.value;
//           dto.user_key = item?.user_id;
//           dto.job_company = item?.job_company;
//           ret.push(dto);
//         });
//       }
//     }
//     return ret;
//   };

//   handleClickViewMore = () => {
//     if (this.user_request_key) {
//       this.router.navigateByUrl('/candidate-detail/' + this.user_request_key);
//     }
//   };

//   addUser = (user: any, isSync = false) => {
//     this.userName = user?.value;
//     this.user_profile_key = user?._key;
//     this.isExpan = false;
//     if (!isSync) {
//       this.filterCommonAppended = {};
//       this.filterCommon = {};
//     }
//     this.removeSearch();

//     this.setSkeleton(true);

//     // //save keyword to localstorage
//     localStorage.setItem(
//       StorageKey.KEYWORD + `_${this.user_id}_job`,
//       JSON.stringify({ ...user })
//     );

//     // // const getDataFromCompanyValue = this.dataSuggestAll.filter(f => f?.value === company?.value).map(m => m._key);
//     if (this.user_profile_key) {
//       this.getDetailUser(user?.user_id).then((r) => {
//         this.userSelect = r;
//         this.dataSuggest = [];
//         this.currentSearch = user;
//         this.user_request_key = user?.user_key;
//         this.submitSearch();
//       });
//     } else {
//       this.callSearchAll();
//     }
//   };


//   private callSearchAll() {
//     this.isExpan = true;
//     this.user_request_key = null;
//     this.matchingUser(null).then((res) => {
//       this.getDataByRound().then((r) => {
//         // this.isLoading = false;
//         this.setSkeleton(false);
//       });
//     });
//   }

//   loadNext = (event) => {
//     if (
//       (this.userSelect.length !== 0 && this.cardSkeleton.length === 0) ||
//       this.dataFilter.length !== 0
//     ) {
//       const startPos = event.target.scrollTop;
//       const pos =
//         (event.target.scrollTop || document.body.scrollTop) +
//         document.documentElement.offsetHeight;
//       const max = event.target.scrollHeight;
//       // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
//       if (pos >= max) {
//         if (!this.spinnerLoading) {
//           // Coding something 😋😋😋

//           if (this.currentTab === 'R' && this.textDataEnd === '') {
//             if (this.dataIncludesId.length >= 8) {
//               this.setSkeleton(true);
//               // this.spinnerLoading = true;

//               this.getDataByRound().then((r) => {
//                 // this.filterMain();
//               });
//             } else {
//               this.textDataEnd = '022';
//               // setTimeout(() => {
//               // this.setSkeleton(false);

//               // }, 1000)
//             }
//           } else {
//             if (this.dataIncludesIdSave.length >= 8) {
//               // this.spinnerLoading = true;
//               this.setSkeleton(true);
//               this.getDataByRoundSave().then((r) => {
//                 // this.filterMain();
//               });
//             } else {
//               this.textDataEnd = '022';
//               // setTimeout(() => {
//               //   this.setSkeleton(false);

//               // }, 1000)
//             }
//           }
//           // this.spinnerLoading = false;
//         }
//       }

//       if (startPos !== 0) {
//       }
//     }
//   };

//   getPlaceHolder = () =>
//     !this.isObjectEmpty(this.currentSearch)
//       ? ''
//       : this.getTitlePlaceholderSearch();
//   getTitleSearchBtn = () =>
//     this.translateService.translate(
//       RECOMMENCED_JOB_CODE_CAPTIONS.TITLE_BUTTON_SEARCH
//     );

//   getTitlePlaceholderSearch = () =>
//     this.translateService.translate(
//       RECOMMENCED_JOB_CODE_CAPTIONS.PLACEHOLDER_SEARCH_BAR
//     );

//   handleInput = (value) => {
//     this.addressSearch = value;
//   };

//   // Highlight name option when user type
//   highlightName = (name) => {
//     if (/[a-zA-Z0-9]/.test(name)) {
//       const res = name.replace(
//         new RegExp(this.addressSearch.trim(), 'gmi'),
//         (match) => {
//           return `<b class="hightlighted" style="background:yellow">${match}</b>`;
//         }
//       );

//       return res;
//     }
//     return name;
//   };

//   getDate = (d) => this.dateFormatService.formatDate(d, 'display');

//   // Get Data by round and base on all of result
//   getDataByRound = async (take = 8) => {
//     if (this.currentRound !== this.round) {
//       this.currentRound = this.round;
//       // return data by round
//       const from = 0 + take * (this.round - 1);
//       const to = this.round * take;
//       if (this.dataFilter.length <= this.dataIncludesId.length) {
//         const ids = this.dataIncludesId
//           .map((d) => d.value)
//           .slice(from, to)
//           .filter((x) => !!x); // value is user_profile key
//         const detail = await this.getDetailMatching(ids);

//         if (detail.length === 0 && this.dataFilter.length !== 0) {
//           this.textDataNull = '';
//           this.textDataNullSave = '';
//           this.textDataEnd = '022';
//           this.setSkeleton(false);
//         } else {
//           this.textDataNull = '';
//           this.textDataNullSave = '';
//           const uq = AitAppUtils.getUniqueArray(
//             [...this.dataFilter, ...(detail || [])],
//             '_key'
//           ).filter((f) => f?._key);

//           let data = [];

//           if (this.user_request_key) {
//             data = uq.map((d) => ({
//               ...d,
//               total_score: this.dataIncludesId.find((f) => f.value === d._key)
//                 ?.total_score,
//               group_no: this.dataIncludesId.find((f) => f.value === d._key)
//                 ?.group_no,
//               // current_salary: 100000,
//               // salary : 1000000
//             }));
//           } else {
//             data = uq.map((d) => ({
//               ...d,
//               total_score: this.dataIncludesId.find((f) => f.value === d._key)
//                 ?.total_score,
//               group_no: 3,
//               // current_salary: 100000,
//               // salary : 1000000
//             }));
//           }
//           this.dataFilter = data || this.dataFilterDf;
//           this.dataFilterDf = data || this.dataFilterDf;

//           if (!AitAppUtils.isObjectEmpty(this.filterCommon)) {
//             this.filterMain();
//           }

//           this.setSkeleton(false);

//           if (this.dataFilter.length === 0) {
//             this.textDataNull = '021';
//           }
//           this.round++;
//         }

//         // push total score to detail
//       }
//     }
//   };

//   handleClickButton = () => {
//     const target = this.currentSearch;
//     // this.removeSearch(true);
//     this.addUser(target);
//   };

//   // Get Data by round and base on all of result
//   getDataByRoundSave = async (take = 8) => {
//     // return data by round

//     const from = 0 + take * (this.round - 1);
//     const to = this.round * take;
//     const ids = this.dataIncludesIdSave.map((m) => m?.value).slice(from, to); // value is user_profile key
//     const detail = await this.getDetailMatching(ids);

//     if (detail.length === 0) {
//       this.textDataNull = '';
//       this.textDataNullSave = '';
//       this.textDataEnd = '022';
//       this.setSkeleton(false);
//     } else {
//       // push total score to detail
//       const uq = AitAppUtils.getUniqueArray(
//         [...this.dataFilterSave, ...(detail || [])],
//         '_key'
//       ).filter((f) => f?._key);
//       if (uq.length === 0) {
//         this.textDataNullSave = '021';
//       }
//       const data = uq.map((d) => ({
//         ...d,
//         total_score: this.dataIncludesIdSave.find((f) => f.value === d._key)
//           ?.total_score,
//         group_no: this.dataIncludesIdSave.find((f) => f.value === d._key)
//           ?.group_no,
//       }));

//       const target = (data || []).sort(
//         (a, b) => (a.group_no || 99) - (b.group_no || 99)
//       );

//       this.dataFilterSave = target || this.dataFilterSave;
//       this.dataFilterSaveDf = target || this.dataFilterSaveDf;
//       this.round++;
//       // this.setSkeleton(false);
//       if (!AitAppUtils.isObjectEmpty(this.filterCommon)) {
//         this.filterMain();
//       }
//       this.setSkeleton(false);
//     }
//   };

//   handleClickChipInput(e) {
//     e.preventDefault();
//   }

//   // thêm nút scroll to top : TODO

//   resetRound = () => (this.round = 1);

//   getTabSelect = (tab) => {
//     this.dataFilterSave = [];
//     this.dataFilterSaveDf = [];
//     this.dataFilterDf = [];
//     this.dataFilter = [];
//     this.textDataNull = '';
//     this.textDataNullSave = '';
//     this.textDataEnd = '';
//     this.currentRound = 0;

//     this.isLoading = true;
//     this.resetRound();

//     this.currentTab = tab.value;
//     if (this.currentTab !== 'R') {
//       this.setSkeleton(true);
//       this.recommencedJobService
//         .getDataTabSave(this.user_request_key || this.company)
//         .then((r) => {
//           if (r.status === RESULT_STATUS.OK) {
//             if (r.data && r.data.length !== 0) {
//               const _keys = (r.data || [])
//                 .map((d) => d?.vertex?._key)
//                 .filter((x) => !!x);
//               if (_keys.length !== 0) {
//                 this.recommencedJobService
//                   .matchingUser(this.user_request_key || this.company, _keys)
//                   .then((r) => {
//                     if (r.status === RESULT_STATUS.OK) {
//                       this.dataIncludesIdSave = r.data || [];
//                       if (this.dataIncludesIdSave.length !== 0) {
//                         this.getDataByRoundSave().then((r) => {
//                           // this.isLoading = false;
//                           // this.setSkeleton(false);
//                         });
//                       } else {
//                         this.setSkeleton(false);
//                         this.textDataNullSave = '021';
//                       }
//                     }
//                   });
//               } else {
//                 this.setSkeleton(false);
//                 this.textDataNullSave = '021';
//               }
//             } else {
//               this.setSkeleton(false);
//               this.textDataNullSave = '021';
//             }
//           }
//         });
//     } else {
//       this.setSkeleton(true);
//       this.submitSearch();
//       this.isLoading = false;
//     }
//   };
// }
// // import { Component, OnInit } from '@angular/core';

// // @Component({
// //   selector: 'ait-recommenced-job',
// //   templateUrl: './recommenced-job.component.html',
// //   styleUrls: ['./recommenced-job.component.scss']
// // })
// // export class RecommencedJobComponent implements OnInit {

// //   constructor() { }

// //   ngOnInit(): void {
// //   }

// // }

/* eslint-disable @typescript-eslint/no-explicit-any */
import { CompanyInfoDto, hasLength, isArrayFull, RESULT_STATUS } from '@ait/shared';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NbLayoutScrollService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
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
import { Apollo } from 'apollo-angular';
import { StoreKeywordsSearch } from '../../../state/actions';
import { ReactionService } from '../../../services/recommen/reaction.service';
import { RecommencedUserService } from '../../../services/recommen/recommenced-user.service';

export enum StorageKey {
  KEYWORD = 'keyword',
  FILTER = 'filter',
}

@Component({
  selector: 'ait-recommenced-job',
  templateUrl: './recommenced-job.component.html',
  styleUrls: ['./recommenced-job.component.scss']
})
export class RecommencedJobComponent 
  extends AitBaseComponent
  implements OnInit {
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
    private masterDataService: AitMasterDataService,
    private matchingCompanyService: RecommencedUserService,
    private reactionService: ReactionService,
    private translateService: AitTranslationService,
    store: Store<AppState | any>,
    authService: AitAuthService,
    router: Router,
    env: AitEnvironmentService,
    apollo: Apollo
  ) {
    super(store, authService, apollo, null, env, layoutScrollService,null,null,router);
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
      title: 't_019',
      tabIcon: 'star',
      type: 'R',
    },
    {
      title: 't_020',
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

  private getDetailMatching = async (list_ids: string[]) => {
    const res = await this.matchingCompanyService.getDetailMatching(
      this.company_key || this.company,
      list_ids
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

    this.matchingCompany(this.company_key || null).then((m) => {
      this.getDataByRound().then((r) => {
        // this.isLoading = false;
        // this.setSkeleton(false);
      });
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

  ngOnInit() {
    const keyword: any = JSON.parse(
      localStorage.getItem(StorageKey.KEYWORD + `_${this.user_id}`)
    );
    // const filter =
    //   localStorage.getItem(
    //     StorageKey.FILTER + `_${this.user_id}`)
    //     ? JSON.parse(localStorage.getItem(StorageKey.FILTER + `_${this.user_id}`))
    //     : {};
    if (keyword?._key) {
      //mannq change
      // this.filterCommon = filter;
      // this.filterCommonAppended = filter;
      this.addCompany(keyword, true);

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
        this.messageSearch = '';
        if (text) {
          this.matchingCompanyService.searchCompany(text).then((r) => {
            if (r.status === RESULT_STATUS.OK) {
              const target = r?.data;
              if (target.length !== 0) {
                this.dataSuggestAll = target;
                this.dataSuggest = AitAppUtils.getUniqueArray(
                  target || [],
                  'value'
                );
              } else {
                this.dataSuggestAll = [];
                this.dataSuggest = [];
                this.messageSearch = 'データがありません。';
              }
            }
          });
        } else {
          this.dataSuggestAll = [];
          this.dataSuggest = [];
        }
      });
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
    this.matchingCompany(null).then((res) => {
      this.getDataByRound().then((r) => {
        // this.isLoading = false;
        this.setSkeleton(false);
      });
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

              this.getDataByRound().then((r) => {
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
                .then((r) => {
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
  getDataByRound = async (take = 8) => {
    if (this.currentRound !== this.round) {
      this.currentRound = this.round;
      // return data by round
      const from = 0 + take * (this.round - 1);
      const to = this.round * take;
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
      }
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
          if (r.status === RESULT_STATUS.OK) {
            if (r.data && r.data.length !== 0) {
              const _keys = (r.data || [])
                .map((d) => d?.vertex?.user_profile?.user_id)
                .filter((x) => !!x);
              if (_keys.length !== 0) {
                this.matchingCompanyService
                  .matchingCompany(this.company_key || this.company, _keys)
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
}

