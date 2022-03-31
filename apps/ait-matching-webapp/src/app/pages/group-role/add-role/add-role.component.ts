import { GroupRoleRegisterService } from './../../../services/group-role-register.service';
import { AddRoleService } from './../../../services/add-role.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  AitAuthService,
  AitBaseComponent,
  AppState,
  MODE,
  AitEnvironmentService,
  AitAppUtils,
} from '@ait/ui';
import { Apollo } from 'apollo-angular';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import {
  isObjectFull,
  KEYS,
  KeyValueDto,
  PERMISSIONS,
  RESULT_STATUS,
} from '@ait/shared';

@Component({
  selector: 'ait-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
})
export class AddRoleComponent extends AitBaseComponent implements OnInit {
  roleForm: FormGroup;
  roleFormClone: FormGroup;

  groupRole = null;
  mode = MODE.NEW;
  isExist = false;
  isReset = false;
  isSubmit = false;
  isChanged = false;
  isCoppy = false;
  name: string;
  remark: string;
  roleUser_key: string;

  employeeList: any[] = [];

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private addRoleService: AddRoleService,
    private groupRoleRegisterService: GroupRoleRegisterService,

    env: AitEnvironmentService,
    store: Store<AppState>,
    apollo: Apollo,
    authService: AitAuthService,
    toastrService: NbToastrService,
    layoutScrollService: NbLayoutScrollService
  ) {
    super(
      store,
      authService,
      apollo,
      null,
      env,
      layoutScrollService,
      toastrService
    );

    this.roleForm = this.formBuilder.group({
      _key: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      remark: new FormControl(null),
      module: new FormControl(null, [Validators.required]),
      page: new FormControl(null, [Validators.required]),
      employee_name: new FormControl(null, [Validators.required]),
      permission: new FormControl(null, [Validators.required]),
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getEmployee();
    this.groupRole = this.groupRoleRegisterService?.groupRole;
    this.name = this.groupRole?.name;
    this.remark = this.groupRole?.remark;
    this.roleUser_key = this.addRoleService?.roleUser_key;

    if (this.roleUser_key) {
      this.mode = MODE.EDIT;
      await this.getRoleUserInfo();
      await this.roleForm.valueChanges.subscribe((data) => {
        this.checkAllowSave();
      });
    }
  }

  async getEmployee() {
    await this.addRoleService.getEmployee().then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        const data = [];
        (res.data || []).forEach((e: any) =>
          data.push({ _key: e?._key, value: e?.full_name })
        );
        this.employeeList = data;
      }
    });
  }

  async getRoleUserInfo() {
    const result = await this.addRoleService.getRoleUserInfo(this.roleUser_key);

    this.roleForm.patchValue({ ...result.data[0] });
    this.roleFormClone = this.roleForm.value;
  }

  checkAllowSave() {
    const roleUserInfoClone = { ...this.roleFormClone };
    const roleUserInfo = { ...this.roleForm.value };
    this.isChanged = !AitAppUtils.isObjectEqual(
      { ...roleUserInfo },
      { ...roleUserInfoClone }
    );
  }

  clear() {
    this.isReset = true;
    setTimeout(() => {
      this.isReset = false;
    }, 100);
    this.roleForm.reset();
  }

  async save() {

    if (this.roleForm.valid) {
      let saveRoleInfo = {};
      saveRoleInfo = this.roleForm.value;
      saveRoleInfo['groupName'] = this.name;
      saveRoleInfo['remarkGroup'] = this.remark;
      const _from = [
        { _from: 'sys_user/' + saveRoleInfo['_key'] },
      ];
      await this.addRoleService.removeRoleUser(_from)
      await this.saveRoleUser(
        saveRoleInfo['_key'],
        saveRoleInfo['permission'],
        saveRoleInfo['employee_name']._key,
        saveRoleInfo['name'],
        saveRoleInfo['remark'],
        saveRoleInfo['module']._key,
        saveRoleInfo['page']._key
      ).then((res) => {
        if (res?.status === RESULT_STATUS.OK) {
          const message =
            this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
          this.showToastr('', message);
          this.cancelLoadingApp();
        } else {
          this.cancelLoadingApp();
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }
      });
    }
  }

  async saveRoleUser(
    role_key: string,
    permission: string,
    user_key: string,
    name: string,
    remark: string,
    module_key: string,
    page_key: string
  ) {
    const permissionArr = permission.split(', ');
    const sys_role_page = {
      _from: 'sys_role/' + role_key,
      _to: 'sys_user/' + user_key,
      permission: permissionArr,
      name: name,
      remark: remark,
      module: module_key,
      page: page_key,
    };
    return await this.groupRoleRegisterService.saveRoleUser(sys_role_page);
  }



  add() {
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);
    if (this.roleForm.valid) {
      let saveRoleInfo = {};
      saveRoleInfo = this.roleForm.value;
      saveRoleInfo['groupName'] = this.name;
      saveRoleInfo['remarkGroup'] = this.remark;

      this.groupRoleRegisterService.roleDataSave = saveRoleInfo;
      history.back();
    } else {
      this.getFormValidationErrors();
    }
  }

  takeInputValue(value: string, form: string): void {
    if (value) {
      this.roleForm.controls[form].markAsDirty();
      this.roleForm.controls[form].setValue(value);
    } else {
      this.roleForm.controls[form].setValue(null);
    }
  }

  takeMasterValue(value: KeyValueDto[] | KeyValueDto, form: string): void {
    if (isObjectFull(value)) {
      this.roleForm.controls[form].markAsDirty();
      this.roleForm.controls[form].setValue(value[0]);
    } else {
      this.roleForm.controls[form].setValue(null);
    }
  }

  takeMasterValues(value: KeyValueDto[], form: string): void {
    if (value !== []) {
      if (isObjectFull(value)) {
        this.roleForm.controls[form].markAsDirty();
        this.roleForm.controls[form].setValue(value);
      } else {
        this.roleForm.controls[form].setValue(null);
      }
    }
  }

  getFormValidationErrors() {
    Object.keys(this.roleForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.roleForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          console.log(
            'Key control: ' + key + ', keyError: ' + keyError + ', err value: ',
            controlErrors[keyError]
          );
        });
      }
    });
  }
}
