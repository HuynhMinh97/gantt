import { GroupRoleRegisterService } from './../../../services/group-role-register.service';
import { AddRoleService } from './../../../services/add-role.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AitAuthService, AitBaseComponent, AppState, MODE, AitEnvironmentService } from '@ait/ui';
import { Apollo } from 'apollo-angular';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { isObjectFull, KeyValueDto, PERMISSIONS, RESULT_STATUS } from '@ait/shared';

@Component({
  selector: 'ait-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent extends AitBaseComponent implements OnInit {

  roleForm: FormGroup;

  groupRole = null;
  mode = MODE.NEW;
  isExist = false;
  isReset = false;
  isSubmit = false;
  isChanged = false;
  isCoppy = false;
  name: string;
  employeeList : any[]=[] 

  permission = [
    {
      _key: PERMISSIONS.CREATE,
      value: PERMISSIONS.CREATE
    },
    {
      _key: PERMISSIONS.READ,
      value: PERMISSIONS.READ
    },{
      _key: PERMISSIONS.UPDATE,
      value: PERMISSIONS.UPDATE
    },{
      _key: PERMISSIONS.DELETE,
      value: PERMISSIONS.DELETE
    },
  ]
  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private addRoleService: AddRoleService,
    private groupRoleRegisterService : GroupRoleRegisterService,
    
    env: AitEnvironmentService,
    store: Store<AppState>,
    apollo: Apollo,
    authService: AitAuthService,
    toastrService: NbToastrService,
    layoutScrollService: NbLayoutScrollService,
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
      name: new FormControl(null, [Validators.required]),
      remark: new FormControl(null),
      module: new FormControl(null, [Validators.required]),
      page: new FormControl(null, [Validators.required]),
      employee: new FormControl(null, [Validators.required]),
      permission: new FormControl(null, [Validators.required]),
    })
  }

  async ngOnInit(): Promise<void> {
    this.groupRole = this.groupRoleRegisterService.groupRole
    this.name =  this.groupRole.name;
    await this.getEmployee();
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
    })
    console.log(this.employeeList)
  }

  clear(){
    this.isReset = true;
    setTimeout(() => {
      this.isReset = false;
    }, 100);
    this.roleForm.reset();
  }


  add() {
    this.isSubmit = true;
    setTimeout(() => {
      this.isSubmit = false;
    }, 100);
    if (this.roleForm.valid){
      this.groupRoleRegisterService.roleDataSave = this.roleForm.value;
      history.back();
    }
    else {
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

  takeMasterValue(
    value: KeyValueDto[] | KeyValueDto,
    form: string
  ): void {    
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
