/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  isArrayFull,
  isObjectFull,
  KEYS,
  KeyValueDto,
  RESULT_STATUS,
} from '@ait/shared';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { MODE } from '../../@constant';
import {
  AitAuthService,
  AitEnvironmentService,
  AitRenderPageService,
  AitSaveTempService,
  AitUserService,
} from '../../services';
import { AppState } from '../../state/selectors';
import { AitBaseComponent } from '../base.component';

@Component({
  selector: 'ait-group-input',
  templateUrl: './ait-group-input.component.html',
  styleUrls: ['./ait-group-input.component.scss'],
})
export class AitGroupInputComponent extends AitBaseComponent implements OnInit {
  @Input() style: any;
  @Input() _key: string;
  @Input() page: string;
  @Input() module: string;
  inputForm: FormGroup;
  moduleKey: string;
  groupKey: string;
  pageKey: string;
  collection: string;
  mode = MODE.NEW;
  isReset = false;
  isSubmit = false;
  isChanged = false;
  searchComponents: any;
  leftSide: any[] = [];
  rightSide: any[] = [];
  constructor(
    private renderPageService: AitRenderPageService,
    public router: Router,
    public store: Store<AppState>,
    authService: AitAuthService,
    userService: AitUserService,
    toastrService: NbToastrService,
    env: AitEnvironmentService,
    layoutScrollService: NbLayoutScrollService,
    apollo: Apollo,
    saveTempService: AitSaveTempService
  ) {
    super(
      store,
      authService,
      apollo,
      userService,
      env,
      layoutScrollService,
      toastrService,
      saveTempService
    );
  }

  async ngOnInit(): Promise<void> {
    this.setupData();
    if (this._key) {
      this.mode = MODE.EDIT;
    }
  }

  async setupData() {
    const resModule = await this.renderPageService.findModule({
      code: this.module,
    });
    const resPage = await this.renderPageService.findPage({ code: this.page });
    if (
      resModule.status === RESULT_STATUS.OK &&
      resPage.status === RESULT_STATUS.OK
    ) {
      this.moduleKey = resModule.data[0]?._key || '';
      this.pageKey = resPage.data[0]?._key || '';

      const resGroup = await this.renderPageService.findGroup({
        module: this.moduleKey,
        page: this.pageKey,
        type: 'input',
      });
      if (resGroup.status === RESULT_STATUS.OK) {
        this.groupKey = resGroup.data[0]?._key || '';
        this.collection = resGroup.data[0]?.collection || '';

        const resSearch = await this.renderPageService.findSysInput({
          module: this.moduleKey,
          page: this.pageKey,
          group: this.groupKey,
        });

        if (
          resSearch.status === RESULT_STATUS.OK &&
          resSearch?.data?.length > 0
        ) {
          this.searchComponents = resSearch.data;
          this.setupForm(this.searchComponents);
          this.setupComponent(this.searchComponents);  
          if (this._key) {
            this.patchDataToForm();
          }
        }
      }
    }
  }
  
  async patchDataToForm() {
    const res = await this.renderPageService.findDataByCollection(
      this.collection,
      this._key
    );
    if (res.data.length > 0) {
      const data = res.data[0]['data'];
      console.log(data);
      this.inputForm.patchValue(JSON.parse(data));
      console.log(this.inputForm.value);
    }
  }

  setupComponent(components: any[]) {
    console.log(components);
    const leftSide = [];
    const rightSide = [];
    components.forEach((component) => {
      if (component.col_no === 1) {
        leftSide.push(component);
      } else {
        rightSide.push(component);
      }
    });
    this.leftSide = leftSide.sort((a, b) => a.row_no - b.row_no);
    this.rightSide = rightSide.sort((a, b) => a.row_no - b.row_no);
  }

  setupForm(components: any[]) {
    const group = {};
    components.forEach((component) => {
      if (component.item_id) {
        if (
          component.type === 'date' &&
          component?.component_setting?.from_to
        ) {
          group[component.item_id + '_from'] = new FormControl();
          group[component.item_id + '_to'] = new FormControl();
        } else {
          group[component.item_id] = new FormControl(null, Validators.required);
        }
      }
    });
    this.inputForm = new FormGroup(group);
  }

  takeInputValue(value: string, form: string): void {
    if (value) {
      this.inputForm.controls[form].markAsDirty();
      this.inputForm.controls[form].setValue(value);
    } else {
      this.inputForm.controls[form].setValue(null);
    }
  }

  takeMaster(
    value: KeyValueDto[] | KeyValueDto,
    form: string,
    numItem: number | unknown
  ): void {
    if (numItem === 1) {
      this.takeMasterValue(value, form);
    } else {
      this.takeMasterValues((value || []) as KeyValueDto[], form);
    }
  }

  takeMasterValue(value: KeyValueDto[] | KeyValueDto, form: string): void {
    if (isObjectFull(value)) {
      this.inputForm.controls[form].markAsDirty();
      this.inputForm.controls[form].setValue(
        isArrayFull(value) ? value[0] : value
      );
    } else {
      this.inputForm.controls[form].setValue(null);
    }
  }

  // Take values form components and assign to form
  takeMasterValues(value: KeyValueDto[], form: string): void {
    if (isArrayFull(value)) {
      this.inputForm.controls[form].markAsDirty();
      this.inputForm.controls[form].setValue(value);
    } else {
      this.inputForm.controls[form].setValue(null);
    }
  }

  takeDatePickerValue(value: number, form: string): void {
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this.inputForm.controls[form].markAsDirty();
      this.inputForm.controls[form].setValue(value);
    } else {
      this.inputForm.controls[form].setValue(null);
    }
  }

  reset(event: any) {
    event.preventDefault();
    this.inputForm.reset();
    // this.isCreateAtError = false;
    // this.isChangeAtError = false;
    // this.isReset = true;
    // this.clearTemp();
    setTimeout(() => {
      // this.isReset = false;
    }, 100);
    // this.showToastr('', this.getMsg('I0007'));
  }

  search(event = null, isInit = false) {
    if (event) {
      event.preventDefault();
    }
    if (this.inputForm.valid) {
      console.log(this.inputForm.value);
    } else {
      console.log('form invalid');
    }
  }

  clear() {
    if (this.mode === MODE.NEW) {
      this.inputForm.reset();
      this.isReset = true;
      setTimeout(() => {
        this.isReset = false;
      }, 100);
    } else {
      console.log('edit');
    }
  }
  save() {
    this.isSubmit = true;
    if (this.inputForm.valid) {
      const objSave = {};
      const formValue = this.inputForm.value;
      for (const prop in formValue) {
        if (isObjectFull(formValue[prop])) {
          objSave[prop] = formValue[prop][KEYS.KEY];
        } else {
          objSave[prop] = formValue[prop];
        }
      }
      this.renderPageService
        .saveRenderData(this.collection, [objSave])
        .then((res) => {
          if (res.status === RESULT_STATUS.OK) {
            this.showToastr('', this.getMsg('I0005'));
            setTimeout(() => {
              history.back();
            }, 1000);
          } else {
            this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
          }
        })
        .catch(() => this.showToastr('', this.getMsg('E0100'), KEYS.WARNING));
    }
  }
}
