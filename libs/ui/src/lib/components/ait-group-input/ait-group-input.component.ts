/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  isArrayFull,
  isObjectFull,
  KEYS,
  KeyValueDto,
  PAGE_TYPE,
  PERMISSIONS,
  RESULT_STATUS,
} from '@ait/shared';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NbDialogService,
  NbLayoutScrollService,
  NbToastrService,
} from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import _ from 'lodash';
import { MODE } from '../../@constant';
import {
  AitAuthService,
  AitEnvironmentService,
  AitRenderPageService,
  AitSaveTempService,
  AitTranslationService,
  AitUserService,
} from '../../services';
import { AppState } from '../../state/selectors';
import { AitConfirmDialogComponent } from '../ait-confirm-dialog/ait-confirm-dialog.component';
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
  @Input() content: string;
  @Input() public save: (objSave: any) => Promise<any>;
  @Input() public find: (objFind: any) => Promise<any>;
  @Input() public delete: (objDelete: any) => Promise<any>;
  @Input() public default: (objDelete: any) => Promise<any>;
  inputForm: FormGroup;
  moduleKey: string;
  groupKey: string;
  pageKey: string;
  collection: string;
  mode = MODE.NEW;
  isReset = false;
  isSubmit = false;
  isChanged = false;
  isDialogOpen = false;
  isResetFile = false;
  isClear = false;
  isClearErrors = false;
  isCopy = false;
  isAllowDelete = false;
  cloneData: any;
  searchComponents: any;
  dateErrorObject = {};
  dateErrorMessage = {};
  leftSide: any[] = [];
  rightSide: any[] = [];
  multiLang: string[] = [];
  pageTitle = '';
  constructor(
    private renderPageService: AitRenderPageService,
    public router: Router,
    private dialogService: NbDialogService,
    private translateService: AitTranslationService,
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
    setTimeout(() => {
      this.setModulePage({
        page: this.page,
        module: this.module,
        type: this._key ? PAGE_TYPE.EDIT : PAGE_TYPE.NEW
      });
    }, 0);
  }

  async ngOnInit(): Promise<void> {
    this.setupData();
    this.isCopy = !!localStorage.getItem('isCopy');
    localStorage.setItem('isCopy', '');
    if (this._key && !this.isCopy) {
      this.mode = MODE.EDIT;
    }
  }

  async setupData() {
    this.callLoadingApp();
    try {
      const resModule = await this.renderPageService.findModule({
        code: this.module,
      });
      const resPage = await this.renderPageService.findPage({
        code: this.page,
      });
      if (
        resModule.status === RESULT_STATUS.OK &&
        resPage.status === RESULT_STATUS.OK
      ) {
        this.moduleKey = resModule.data[0]?.code || '';
        this.pageKey = resPage.data[0]?.code || '';
        this.pageTitle = resPage.data[0]?.name || '';

        const resGroup = await this.renderPageService.findGroup({
          module: this.moduleKey,
          page: this.pageKey,
          type: 'input',
        });

        if (resGroup.status === RESULT_STATUS.OK) {
          this.groupKey = resGroup.data[0]?.code || '';
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
              !this.isCopy &&
                this.inputForm.addControl('_key', new FormControl(null));
              this.patchDataToForm(resSearch.data || []);
            } else if (this.default) {
              this.patchDefaultDataToForm(resSearch.data || []);
            }
          }
        }
      }
    } catch {
      setTimeout(() => {
        this.cancelLoadingApp();
      }, 100);
    } finally {
      setTimeout(() => {
        this.cancelLoadingApp();
      }, 100);
    }
  }

  async patchDefaultDataToForm(data: any[]) {
    const conditions = {};
    this.cloneData = {};
    data.forEach((e) => {
      if (e['search_setting']) {
        const prop = Object.entries(e['search_setting']).reduce(
          (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
          {}
        );
        conditions[e['item_id']] = prop;
      }
    });

    const defaultValue = await this.default(conditions);
    this.inputForm.patchValue(defaultValue);
    (Object.keys(this.inputForm.controls) || []).forEach((name) => {
      this.cloneData[name] = this.inputForm.controls[name].value;
    });
  }

  async patchDataToForm(data: any[]) {
    const conditions = {};
    this.cloneData = {};
    conditions['_key'] = this._key;
    data.forEach((e) => {
      if (e['search_setting']) {
        const prop = Object.entries(e['search_setting']).reduce(
          (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
          {}
        );
        conditions[e['item_id']] = prop;
      }
    });
    if (this.find) {
      const res = await this.find(conditions);
      const data = res.data[0] as any;
      this.inputForm.patchValue(data);
      (Object.keys(this.inputForm.controls) || []).forEach((name) => {
        this.cloneData[name] = this.inputForm.controls[name].value;
      });
    } else {
      const res = await this.renderPageService.findDataByCollection(
        this.collection,
        conditions
      );
      if (res.data.length > 0) {
        const value = JSON.parse(res.data[0]['data'] || '[]');
        if (this.isCopy && value['key']) {
          delete value._key;
        }
        this.inputForm.patchValue(value);
        (Object.keys(this.inputForm.controls) || []).forEach((name) => {
          this.cloneData[name] = this.inputForm.controls[name].value;
        });
      } else {
        this.router.navigate([`/404`]);
      }
    }
  }

  setupComponent(components: any[]) {
    try {
      let leftSide = [];
      let rightSide = [];
      components.forEach((component) => {
        if (component.col_no === 1) {
          leftSide.push(component);
        } else {
          rightSide.push(component);
        }
      });
      leftSide = leftSide.sort((a, b) => a.row_no - b.row_no);
      rightSide = rightSide.sort((a, b) => a.row_no - b.row_no);

      const leftSideIndex = leftSide[leftSide.length - 1]?.row_no;
      const rightSideIndex = rightSide[rightSide.length - 1]?.row_no;
      try {
        [...Array(+leftSideIndex)].forEach((e, i) => {
          const item = leftSide.find((m) => m.row_no == i + 1);
          if (item) {
            this.leftSide.push(item);
          } else {
            this.leftSide.push({ type: 'space' });
          }
        });

        [...Array(+rightSideIndex)].forEach((e, i) => {
          const item = rightSide.find((m) => m.row_no == i + 1);
          if (item) {
            this.rightSide.push(item);
          } else {
            this.rightSide.push({ type: 'space' });
          }
        });
      } catch (e) {
        console.error(e);
      }
    } catch {
      this.cancelLoadingApp();
    }
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
          this.dateErrorObject[component.item_id] = false;
          setTimeout(() => {
            this.dateErrorMessage[component.item_id] = this.getMsg('E0004')
              .replace(
                '{0}',
                `${this.translateService.translate(
                  component.item_label_from || component.item_label
                )} ${component.item_label_from ? '' : 'from'}`
              )
              .replace(
                '{1}',
                `${this.translateService.translate(
                  component.item_label_to || component.item_label
                )} ${component.item_label_to ? '' : 'to'}`
              );
          }, 200);
        } else {
          const isRequired = !!component.component_setting?.required;
          if (isRequired) {
            group[component.item_id] = new FormControl(
              null,
              Validators.required
            );
          } else {
            group[component.item_id] = new FormControl(null);
          }
        }

        if (component['component_setting']?.is_multi_language) {
          this.multiLang.push(component.item_id);
        }
      }
    });
    this.inputForm = new FormGroup(group);
  }

  checkAllowSave() {
    // isChanged
    const currentValue = this.inputForm.value;
    this.isChanged = !_.isEqual(currentValue, this.cloneData);
  }

  takeInputValue(value: string, form: string): void {
    if (value) {
      this.inputForm.controls[form].markAsDirty();
      this.inputForm.controls[form].setValue(value);
    } else {
      this.inputForm.controls[form].setValue(null);
    }
    this.checkAllowSave();
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
    this.checkAllowSave();
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
    this.checkAllowSave();
  }

  // Take values form components and assign to form
  takeMasterValues(value: KeyValueDto[], form: string): void {
    if (isArrayFull(value)) {
      this.inputForm.controls[form].markAsDirty();
      this.inputForm.controls[form].setValue(value);
    } else {
      this.inputForm.controls[form].setValue(null);
    }
    this.checkAllowSave();
  }

  takeDatePickerValue(
    value: number,
    form: string,
    isFromTo = false,
    origin = ''
  ): void {
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this.inputForm.controls[form].markAsDirty();
      this.inputForm.controls[form].setValue(value);
    } else {
      this.inputForm.controls[form].setValue(null);
    }
    this.checkAllowSave();
    if (isFromTo) {
      this.checkDateError(origin);
    }
  }

  checkDateError(origin: string) {
    const valueFrom = this.inputForm.controls[origin + '_from'].value;
    const valueTo = this.inputForm.controls[origin + '_to'].value;

    if (!valueFrom || !valueTo) {
      this.dateErrorObject[origin] = false;
    } else if (valueFrom > valueTo) {
      this.dateErrorObject[origin] = true;
    } else {
      this.dateErrorObject[origin] = false;
    }
  }

  takeFiles(fileList: any[], form: string): void {
    if (isArrayFull(fileList)) {
      const data = [];
      fileList.forEach((file) => {
        data.push(file._key);
      });
      this.inputForm.controls[form].markAsDirty();
      this.inputForm.controls[form].setValue(data);
    } else {
      this.inputForm.controls[form].setValue(null);
    }
  }

  copy() {
    localStorage.setItem('isCopy', 'true');
    window.location.reload();
  }

  reset() {
    this.inputForm.patchValue({ ...this.cloneData });
    for (const prop in this.dateErrorObject) {
      this.dateErrorObject[prop] = false;
    }
  }

  remove() {
    this.isDialogOpen = true;
    this.dialogService
      .open(AitConfirmDialogComponent, {
        context: {
          title: this.translateService.translate('このデータを削除しますか。'),
        },
      })
      .onClose.subscribe(async (event) => {
        this.isDialogOpen = false;
        if (event) {
          this.onDelete();
        }
      });
  }

  async onDelete() {
    this.callLoadingApp();
    try {
      if (this.delete) {
        const res = await this.delete(this._key);
        if (res.status === RESULT_STATUS.OK) {
          this.showToastr('', this.getMsg('I0003'));
          history.back();
        } else {
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }
      } else {
        await this.renderPageService
          .remove(this.collection, this._key)
          .then((res) => {
            if (res.status === RESULT_STATUS.OK) {
              this.showToastr('', this.getMsg('I0003'));
              history.back();
            } else {
              this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
            }
          });
      }
    } catch {
      this.cancelLoadingApp();
    } finally {
      this.cancelLoadingApp();
    }
  }

  clear() {
    this.inputForm.reset();
    this.isReset = true;
    for (const prop in this.dateErrorObject) {
      this.dateErrorObject[prop] = false;
    }
    setTimeout(() => {
      this.isReset = false;
    }, 100);
  }

  isDateValid(): boolean {
    let checked = true;
    for (const prop in this.dateErrorObject) {
      if (this.dateErrorObject[prop]) {
        checked = false;
        break;
      }
    }
    return checked;
  }

  async onSave() {
    this.isSubmit = true;
    const isDateValid = this.isDateValid();
    if (this.inputForm.valid && isDateValid) {
      this.callLoadingApp();
      try {
        const objSave = {};
        const formValue = this.inputForm.value;
        this.isCopy && delete formValue[KEYS.KEY];
        for (const prop in formValue) {
          if (isObjectFull(formValue[prop])) {
            if (isArrayFull(formValue[prop])) {
              const keyArray = [];
              formValue[prop].forEach((e: KeyValueDto | string) => {
                if (typeof e === 'string') {
                  keyArray.push(e);
                } else {
                  keyArray.push(e[KEYS.KEY]);
                }
              });
              objSave[prop] = keyArray;
            } else {
              objSave[prop] = formValue[prop][KEYS.KEY];
            }
          } else if (
            this.multiLang.includes(prop) &&
            typeof formValue[prop] === 'string'
          ) {
            objSave[prop] = this.getMultiLang(formValue[prop]);
          } else {
            objSave[prop] = formValue[prop];
          }
        }

        if (this.save) {
          const res = await this.save(objSave);
          if (res.status === RESULT_STATUS.OK) {
            this.showToastr('', this.getMsg('I0005'));
            setTimeout(() => {
              history.back();
            }, 1000);
          } else {
            this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
          }
        } else {
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
            .catch(() =>
              this.showToastr('', this.getMsg('E0100'), KEYS.WARNING)
            );
        }
      } catch {
        this.cancelLoadingApp();
      } finally {
        this.cancelLoadingApp();
      }
    }
  }

  getMultiLang(text: any): any {
    return {
      ja_JP: text,
      en_US: text,
      vi_VN: text,
    };
  }

  toggle(checked: boolean, form: string): void {
    this.inputForm.controls[form].setValue(checked);
  }

  getCheckBoxTitle(title: string): string {
    return this.translateService.translate(title);
  }

  getDefaultValue(form: string, maxItem: any): any {
    if (maxItem === 1) {
      return this.inputForm.controls[form].value
        ? [this.inputForm.controls[form].value]
        : null;
    } else {
      return this.inputForm.controls[form].value;
    }
  }
}
