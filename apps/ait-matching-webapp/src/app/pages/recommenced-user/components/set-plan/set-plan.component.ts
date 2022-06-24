/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getAdvancedMM,
  getMonth,
  getSimpleMM,
  KEYS,
  RESULT_STATUS,
} from '@ait/shared';
import {
  AitAuthService,
  AitBaseComponent,
  AitConfirmDialogComponent,
  AitEnvironmentService,
  AppState,
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NbDialogService,
  NbLayoutScrollService,
  NbToastrService,
} from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { BizProjectService } from '../../../../services/biz_project.service';
import moment from 'moment-business-days';

@Component({
  selector: 'ait-set-plan',
  templateUrl: './set-plan.component.html',
  styleUrls: ['./set-plan.component.scss'],
})
export class SetPlanComponent extends AitBaseComponent implements OnInit {
  planForm: FormGroup;
  planDf = {};
  name = '';
  private monthShortNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  planObj = [];
  monthObj = [];
  thisMonth = this.getMonth();
  isReset = false;
  isSubmit = false;
  isClearErrors = false;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private bizProjectService: BizProjectService,
    private dialogService: NbDialogService,
    layoutScrollService: NbLayoutScrollService,
    store: Store<AppState | any>,
    authService: AitAuthService,
    toastrService: NbToastrService,
    env: AitEnvironmentService,
    apollo: Apollo,
    router: Router
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

    this.planForm = this.formBuilder.group({
      _key: new FormControl(null),
      projectId: new FormControl(null),
      userId: new FormControl(null),
      manmonth_plan: new FormControl(null, [Validators.required]),
      manday_plan: new FormControl(null, [Validators.required]),
      hour_plan: new FormControl(0, [Validators.required]),
      start_plan: new FormControl(0, [Validators.required]),
      end_plan: new FormControl(0, [Validators.required]),
    });

    this.activatedRoute.queryParamMap.subscribe((data) => {
      this.planForm.patchValue(data['params']);
      this.name = data['params']['name'];
      const { projectId, userId } = this.planForm.value;
      if (!this.name || !projectId || !userId) {
        this.router.navigate([`/404`]);
      }
    });
  }

  ngOnInit(): void {
    this.setupPlanData();
  }

  async setupPlanData() {
    const { projectId, userId } = this.planForm.value;
    try {
      const res = await this.bizProjectService.getPlan(projectId, userId);
      if (res.status === RESULT_STATUS.OK && res.data?.length > 0) {
        this.planForm.patchValue(res.data[0]);
        this.planDf = { ...res.data[0] };
      }
    } catch (e) {
      console.log(e);
    }

    [...Array(3)].forEach((e, i) => {
      this.planObj.push({
        _key: this.thisMonth + i + 1,
        value: this.monthShortNames[this.thisMonth + i],
        mm: 0,
      });
      this.monthObj.push(this.thisMonth + i + 1);
    });
  }

  takeDatePickerValue(value: number, form: string): void {
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this.planForm.controls[form].markAsDirty();
      this.planForm.controls[form].setValue(value);
      if (form === 'start_plan') {
        const endPlan = this.planForm.controls['end_plan'].value;
        if (!endPlan) {
          const endMonth = new Date(
            moment(value).endOf('month').valueOf()
          ).setHours(0, 0, 0, 0);
          this.planForm.controls['end_plan'].setValue(endMonth);
        }
      }
      // this.isClearErrors = true;
      // setTimeout(() => {
      //   this.isClearErrors = false;
      // }, 100);
      this.calculatePlan();
    } else {
      this.planForm.controls[form].setValue(null);
    }
  }

  takeInputNumberValue(value: any, form: string) {
    if (value !== '' && value !== null && !isNaN(value)) {
      this.planForm.controls[form].markAsDirty();
      this.planForm.controls[form].setValue(Number(value));
      this.setPlanData(form);
      if (value === 0) {
        this.resetPlan();
      }
    } else {
      this.planForm.controls[form].setValue(null);
      this.resetPlan();
    }
  }

  resetPlan() {
    this.planObj[0].mm = 0;
    this.planObj[1].mm = 0;
    this.planObj[2].mm = 0;
  }

  setPlanData(type: string) {
    const { hour_plan, manday_plan, manmonth_plan } = this.planForm.value;
    if (type === 'hour_plan') {
      this.planForm.controls['manday_plan'].setValue(hour_plan / 20);
      this.planForm.controls['manmonth_plan'].setValue(hour_plan / 160);
      this.calculatePlan();
      return;
    }
    if (type === 'manday_plan') {
      this.planForm.controls['hour_plan'].setValue(manday_plan * 20);
      this.planForm.controls['manmonth_plan'].setValue(manday_plan / 8);
      this.calculatePlan();
      return;
    }
    this.planForm.controls['hour_plan'].setValue(manmonth_plan * 160);
    this.planForm.controls['manday_plan'].setValue(manmonth_plan * 8);
    this.calculatePlan();
  }

  getMonth(date = 0): number {
    try {
      if (date) {
        return new Date(date).getMonth() + 1;
      } else {
        return new Date().getMonth() + 1;
      }
    } catch {
      return null;
    }
  }

  calculatePlan() {
    try {
      const { start_plan, end_plan } = this.planForm.value;
      if (this.planObj.length > 0) {
        this.planObj[0]['mm'] = 0;
        this.planObj[1]['mm'] = 0;
        this.planObj[2]['mm'] = 0;
      }
      const obj = { ...this.planForm.value };
      if (getMonth(end_plan) < this.monthObj[0]) {
        return;
      }
      if (start_plan && end_plan) {
        const startMonth = this.getMonth(start_plan);
        const endMonth = this.getMonth(end_plan);
        const index = this.planObj.findIndex(({ _key }) => _key === startMonth);
        if (startMonth === endMonth && this.monthObj.includes(startMonth)) {
          const mm = getSimpleMM(obj);
          try {
            this.planObj[index]['mm'] = mm;
          } catch (e) {
            console.log(e);
          }
        } else {
          getAdvancedMM(obj, this.planObj, this.monthObj);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  sumMM() {
    if (this.planObj.length === 0) {
      return 0;
    } else {
      return +this.planObj.reduce((a, b) => a + b.mm, 0).toFixed(2);
    }
  }

  getMM(index: number) {
    if (this.planObj.length === 0) return 0;
    return +this.planObj[index]['mm'].toFixed(2);
  }

  getValue(index: number) {
    if (this.planObj.length === 0) return '';
    return this.planObj[index]['value'];
  }

  add() {
    this.isSubmit = true;
    if (!this.planForm.valid) {
      return;
    }
    const {
      _key,
      start_plan,
      end_plan,
      hour_plan,
      manday_plan,
      manmonth_plan,
      projectId,
    } = this.planForm.value;
    if (
      start_plan &&
      end_plan &&
      new Date(start_plan).setHours(0, 0, 0, 0) >
        new Date(end_plan).setHours(0, 0, 0, 0)
    ) {
      this.showToastr(
        '',
        this.getMsg('E0003')
          .replace('{0}', 'start plan')
          .replace('{1}', 'end plan'),
        KEYS.WARNING
      );
      return;
    }

    const saveData = {
      _key,
      start_plan,
      end_plan,
      hour_plan,
      manday_plan,
      manmonth_plan,
    };

    this.bizProjectService.savePlan(saveData).then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        this.showToastr('', this.getMsg('I0005'));
        setTimeout(() => {
          localStorage.setItem('biz_project_key', projectId);
          history.back();
        }, 200);
      } else {
        this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
      }
    });
  }

  clear() {
    this.planForm.reset();
    this.isReset = true;
    setTimeout(() => {
      this.isReset = false;
    }, 100);
    this.isClearErrors = true;
    setTimeout(() => {
      this.isClearErrors = false;
    }, 100);
  }

  reset() {
    this.isClearErrors = true;
    setTimeout(() => {
      this.isClearErrors = false;
    }, 100);

    this.planForm.patchValue(this.planDf);
  }

  remove() {
    this.dialogService
      .open(AitConfirmDialogComponent, {
        closeOnBackdropClick: true,
        hasBackdrop: true,
        autoFocus: false,
        context: {
          title: this.getMsg('I0004'),
        },
      })
      .onClose.subscribe(async (event) => {
        if (event) {
          const { userId, projectId } = this.planForm.value;
          await this.bizProjectService
            .removeBizProjectUser([
              {
                _from: `biz_project/${projectId}`,
                _to: `sys_user/${userId}`,
              },
            ])
            .then((res) => {
              if (res.status === RESULT_STATUS.OK && res.data.length > 0) {
                this.showToastr('', this.getMsg('I0003'));
                history.back();
              } else {
                this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
              }
            });
        }
      });
  }
}
