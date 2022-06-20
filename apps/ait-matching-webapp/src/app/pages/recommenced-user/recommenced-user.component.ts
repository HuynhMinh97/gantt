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
      keyword: new FormControl(''),
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
      padding: '0 15px',
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
  textDataNullTeamMember = '';
  isExpan = false;
  currentTab = 'R';
  isReset = false;

  dataFilter = [];
  dataFilterDf = [];

  dataFilterSave = [];
  dataFilterSaveDf = [];

  dataFilterTeamMember = [];
  dataFilterTeamMemberDf = [];

  matchingList = [];
  matchingSkill = [];
  matchingResult = [];

  filterList = [];

  countMemberDf = [0, 0, 0];
  countMember = [0, 0, 0];
  memberChecked = [false, false, false];

  isSelectAll = true;
  isLoading = true;
  spinnerLoading = false;
  round = 1;
  textDataEnd = '';
  disableTab = false;
  isSubmit = false;

  project_id = '';

  // ngDoCheck() {
  //   console.log(this.dataFilter);
  // }

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
    } else if (this.currentTab === 'S') {
      if (flag) {
        this.cardSkeleton = Array(
          this.getNummberMode8(this.dataFilterSave.length)
        ).fill(1);
      } else {
        this.cardSkeleton = [];
      }
    } else {
      if (flag) {
        this.cardSkeleton = Array(
          this.getNummberMode8(this.dataFilterTeamMember.length)
        ).fill(1);
      } else {
        this.cardSkeleton = [];
      }
    }
  };

  private getDataByProjectId = async (project_id: string) => {
    const res = await this.matchingService.getUserByProjectId(project_id);
    if (res.status === RESULT_STATUS.OK) {
      if (res.data?.length === 0) {
        this.textDataNullTeamMember = 'There is no data to search';
        this.countMember = [0, 0, 0];
      } else {
        this.textDataNullTeamMember = '';
        this.dataFilterTeamMemberDf = this.dataFilterTeamMemberDf
          .concat(res.data)
          .map((e) =>
            Object.assign({
              ...e,
              group_no: this.getGroupNo(e.user_id),
            })
          );
        this.dataFilterTeamMember = [...this.dataFilterTeamMemberDf];
        this.setCountMember(this.dataFilterTeamMemberDf);
        this.currentCount = Math.ceil(this.dataFilterTeamMemberDf.length / 8);
      }
    }
  };

  private getDetailMatching = async (
    list = [],
    onlySaved = 0,
    start = 0,
    end = 8
  ) => {
    if (list.length === 0) {
      const res = await this.matchingService.getDetailMatching(
        onlySaved,
        start * 8,
        end,
        this.project_id
      );
      if (res.status === RESULT_STATUS.OK) {
        if (res.data?.length === 0) {
          onlySaved === 0 && (this.textDataNull = 'There is no data to search');
          onlySaved === 1 &&
            (this.textDataNullTeamMember = 'There is no data to search');
          onlySaved === 2 &&
            (this.textDataNullSave = 'There is no data to search');
        }
        return res.data;
      }
    } else {
      const res = await this.matchingService.getUserByList(
        list,
        onlySaved,
        start * 8,
        end,
        this.project_id
      );
      if (res.status === RESULT_STATUS.OK) {
        if (res.data?.length === 0) {
          onlySaved === 0 && (this.textDataNull = 'There is no data to search');
          onlySaved === 1 &&
            (this.textDataNullTeamMember = 'There is no data to search');
          onlySaved === 2 &&
            (this.textDataNullSave = 'There is no data to search');
        }
        return res.data;
      }
    }
  };

  handleSyncData = ($event) => {
    const { user_id, is_saved, is_team_member } = $event;
    const find = this.dataFilterDf.find((f) => f.user_id === user_id);
    const currentFind = this.dataFilter.find((f) => f.user_id === user_id);
    if (find) {
      find.is_saved = is_saved;
      find.is_team_member = is_team_member;
    }

    if (currentFind) {
      currentFind.is_saved = is_saved;
      currentFind.is_team_member = is_team_member;
    }
  };

  ToggleExpan = () => (this.isExpan = !this.isExpan);

  getTitle = (name: string) => this.translateService.translate(name);

  async ngOnInit() {
    const queriesKey = localStorage.getItem('biz_project_key');
    if (queriesKey) {
      this.project_id = queriesKey;
      localStorage.removeItem('biz_project_key');
      this.bizProjectService.find({ _key: queriesKey }).then((e) => {
        this.isSubmit = true;
        this.isExpan = true;
        const z = e.data[0];
        const obj = {
          keyword: z['keyword'],
          skills: z['skills'],
          province_city: z['location'],
          industry_working: z['industry'],
          current_job_level: z['level'],
          current_job_title: z['title'],
          valid_time_from: z['valid_time_from'],
          valid_time_to: z['valid_time_to'],
        };
        this.searchForm.patchValue({ ...obj });
        this.search();
      });
    }
  }

  private callSearch(list = []) {
    this.getDataByRound(0, list).then(() => {
      this.setSkeleton(false);
      this.filterMain();
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
              this.getDataByRound(0, this.matchingList).then(() => {
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
  getDataByRound = async (onlySaved = 0, list = []) => {
    try {
      const detail = await this.getDetailMatching(
        list,
        onlySaved,
        this.currentCount
      );
      if (isArrayFull(detail) && onlySaved === 0) {
        this.textDataNull = '';
        const temp = this.dataFilterDf.concat(detail).map((e) =>
          Object.assign({
            ...e,
            group_no: this.getGroupNo(e.user_id),
          })
        );
        this.dataFilter = [...temp];
        this.dataFilterDf = [...temp];
        this.currentCount = Math.ceil(this.dataFilterDf.length / 8);
      } else {
        this.textDataNull = 'There is no data';
      }

      if (isArrayFull(detail) && onlySaved === 1) {
        this.textDataNullTeamMember = '';
        this.dataFilterTeamMember = this.dataFilterTeamMember
          .concat(detail)
          .map((e) =>
            Object.assign({
              ...e,
              group_no: this.getGroupNo(e.user_id),
            })
          );
        this.currentCount = Math.ceil(this.dataFilterTeamMemberDf.length / 8);
      } else {
        this.textDataNullTeamMember = 'There is no data';
      }

      if (isArrayFull(detail) && onlySaved === 2) {
        this.textDataNullSave = '';
        this.dataFilterSave = this.dataFilterSave.concat(detail).map((e) =>
          Object.assign({
            ...e,
            group_no: this.getGroupNo(e.user_id),
          })
        );
        this.currentCount = Math.ceil(this.dataFilterSave.length / 8);
      } else {
        this.textDataNullSave = 'There is no data';
      }
      if (
        detail.length === 0 &&
        ((this.dataFilter.length !== 0 && onlySaved === 0) ||
          (this.dataFilterSave.length !== 0 && onlySaved === 1) ||
          (this.dataFilterTeamMember.length !== 0 && onlySaved === 2))
      ) {
        this.textDataNull = '';
        this.textDataNullSave = '';
        this.textDataNullTeamMember = '';
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
    this.countMemberDf = [0, 0, 0];
    this.countMember = [0, 0, 0];
    this.memberChecked = [false, false, false];

    this.currentCount = 0;
    this.textDataEnd = '';
    this.setSkeleton(true);
    this.matchingService.matchingUser(keyword).then((res) => {
      this.matchingResult = res?.data[0].data || [];
      if (this.matchingResult.length > 0) {
        const arr = res.data[0].data.map((e: { item: string }) => e.item);
        this.matchingResult.forEach((e) => {
          if (e?.total_score >= 0.6) {
            this.countMemberDf[0]++;
          } else if (e?.total_score >= 0.2) {
            this.countMemberDf[1]++;
          } else {
            this.countMemberDf[2]++;
          }
        });
        this.countMember = [...this.countMemberDf];
        const matchingSkill = res.data[0].matching_input_data.skill.map(
          (e: any) =>
            Object.assign({ ...e, count: 0, name: '', isSelected: false })
        ) as any[];
        matchingSkill.length > 4 && (matchingSkill.length = 4);
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
        this.matchingSkill = [
          { name: 'All', count: arr.length, isSelected: true },
        ].concat(matchingSkill);
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
    this.dataFilter = [];
    this.dataFilterDf = [];
    this.dataFilterTeamMember = [];
    this.dataFilterTeamMemberDf = [];
    this.dataFilterSave = [];
    this.dataFilterSaveDf = [];
    this.textDataNull = '';
    this.textDataNullSave = '';
    this.textDataNullTeamMember = '';
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
      this.countMember = [...this.countMemberDf];
    } else if (this.currentTab === 'C') {
      if (this.project_id) {
        this.setSkeleton(true);
        this.getDataByProjectId(this.project_id).then(() =>
          this.setSkeleton(false)
        );
      } else {
        this.textDataNullTeamMember = 'There is no data to search';
        this.countMember = [0, 0, 0];
      }
    } else {
      this.setSkeleton(true);
      this.getDataByRound(2).then(() => this.setSkeleton(false));
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
      return;
    } else {
      this.searchForm.controls[form].setValue(null);
    }
    this.filterMain();
  }

  reset(): void {
    const _key = this.searchForm.controls['_key'].value;
    this.project_id = '';
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

  handleCreateBizProject(event: any) {
    if (event) {
      this.save(event);
    }
  }

  save(event = null): void {
    this.project_id = '';
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
                this.project_id = res.data[0]._key;
                if (event) {
                  this.matchingService
                    .saveTeamMember(this.project_id, event.user_id)
                    .then((r) => {
                      if (r.status === RESULT_STATUS.OK) {
                        this.handleSyncData({ ...event, is_team_member: true });
                      }
                    });
                }
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

  filterByType(index: number) {
    this.memberChecked[index] = !this.memberChecked[index];
    this.filterMain();
  }
  //TODO
  filterSkill({ name, item }, index: number): void {
    this.matchingSkill[index].isSelected = !this.matchingSkill[index]
      .isSelected;
    this.setSkeleton(true);
    if (name === 'All') {
      this.isSelectAll = this.matchingSkill[index].isSelected;
      if (this.isSelectAll) {
        this.filterList = [];
        this.matchingSkill.forEach((e, i) => {
          if (i !== 0) {
            this.matchingSkill[i].isSelected = false;
          }
        });
      }
    } else if (this.matchingSkill[index].isSelected) {
      // this.matchingSkill[0].isSelected = false;
      this.filterList = [];
      this.matchingSkill.forEach((e, i) => {
        if (i !== index) {
          this.matchingSkill[i].isSelected = false;
        }
      });
      this.isSelectAll = false;
      this.filterList.push(item);
    } else {
      this.filterList = this.filterList.filter((e) => e !== item);
      if (this.filterList.length === 0) {
        this.matchingSkill[0].isSelected = true;
        this.isSelectAll = true;
      }
    }
    this.filterMain();
    setTimeout(() => {
      this.setSkeleton(false);
    }, 100);
  }

  filterMain(type = 0) {
    if (this.currentTab === 'R') {
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
              } else if (
                isArrayFull(condition[prop]) &&
                isObjectFull(m[prop])
              ) {
                isValid = [m[prop]].some((z: any) =>
                  keyList.includes(z['_key'])
                );
                if (!isValid) break;
              } else if (
                prop === 'valid_time_from' ||
                prop === 'valid_time_to'
              ) {
                if (
                  condition['valid_time_from'] &&
                  !condition['valid_time_to']
                ) {
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
          this.dataFilter = this.filterItem(daveForFilter);
        } else {
          this.dataFilter = this.filterItem([...this.dataFilterDf]);
        }
        if (this.dataFilter.length === 0) {
          this.textDataNull = 'There is no data';
        } else {
          this.textDataNull = '';
        }
      } catch (e) {
        console.log(e);
      }
    } else if (this.currentTab === 'C') {
      const check = [];
      this.memberChecked.forEach((e, i) => e && check.push(i + 1));
      if (check.length > 0) {
        this.dataFilterTeamMember = this.dataFilterTeamMember.filter((e) =>
          check.includes(e.group_no)
        );
        if (this.dataFilterTeamMember.length === 0) {
          this.textDataNullTeamMember = 'There is no data';
        } else {
          this.textDataNullTeamMember = '';
        }
      } else {
        this.dataFilterTeamMember = [...this.dataFilterTeamMemberDf];
      }
    }
  }

  setCountMember = (arr: any[]) => {
    this.countMember = [0, 0, 0];
    arr.forEach((e) => {
      if (e?.group_no === 1) {
        this.countMember[0]++;
      } else if (e?.group_no === 0.2) {
        this.countMember[1]++;
      } else {
        this.countMember[2]++;
      }
    });
  };

  filterItem(data: any[]) {
    const check = [];
    this.memberChecked.forEach((e, i) => e && check.push(i + 1));
    if (check.length === 0 && this.filterList.length === 0) {
      return data;
    }

    return data.filter((e) => {
      let isValid = true;
      if (check.length > 0) {
        isValid = check.includes(e.group_no);
        if (!isValid) {
          return;
        }
      }
      if (this.filterList.length > 0) {
        isValid = e.skills.some(({ _key }) => this.filterList.includes(_key));
        if (!isValid) {
          return;
        }
      }
      return isValid;
    });
  }
}
