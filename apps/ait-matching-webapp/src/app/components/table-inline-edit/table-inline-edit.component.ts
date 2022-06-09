import { isObjectFull, KeyValueDto, RESULT_STATUS } from '@ait/shared';
import { AitAuthService, AitBaseComponent, AitEnvironmentService, AppState, getUserSetting } from '@ait/ui';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import dayjs from 'dayjs';
import { AddRoleService } from '../../services/add-role.service';
import { RegisterProjectService } from '../../services/register-project.service';

@Component({
  selector: 'ait-table-inline-edit',
  templateUrl: './table-inline-edit.component.html',
  styleUrls: ['./table-inline-edit.component.scss']
})
export class TableInlineEditComponent extends AitBaseComponent implements OnInit {
  employeeList: any[] = [];
  isEdit = false;
  _key = '';
  list_candidate = []
  candidateEdit: FormGroup;
  
  @Input() project_key: string
  dateFormat: string;

  constructor(
    private addRoleService: AddRoleService,
    private registerProjectService: RegisterProjectService,
    private formBuilder: FormBuilder,


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
    
    store.pipe(select(getUserSetting)).subscribe((setting) => {
      if (isObjectFull(setting) && setting['date_format_display']) {
        this.dateFormat = setting['date_format_display'];
      }
    });

    this.candidateEdit = this.formBuilder.group({
      employee_name: new FormControl(null),
      _key: new FormControl(null),
      start_plan: new FormControl(null),
      end_plan: new FormControl(null),
      hours_plan: new FormControl(null),
      manday_plan: new FormControl(null),
      manmonth_plan: new FormControl(null),
      remark: new FormControl(null),
    });
  }


  async ngOnInit(): Promise<void> {
    await this.getCandidate();
    await this.getEmployee();

  }

  handleClickEdit(_key:string) {
    this._key = _key;
    this.isEdit = true;
    console.log(this.candidateEdit.value)
  }

  handleClickCancel(){
    this._key = null;
    this.isEdit = false;
  }

  handleClickSave() {
    const data_save = this.candidateEdit.value;
    data_save['employee_name'] = data_save['employee_name'].value;
    data_save['user_id'] = data_save['employee_name']._key;
    debugger
    const list_candidate_clone = this.list_candidate
    list_candidate_clone.forEach((item, index) => {
      if (item._key == data_save._key){
        this.list_candidate[index] = data_save;
        return true
      }
    })
    this.isEdit = false;
  }

  async getCandidate(){
    const result = await this.registerProjectService.getBizProjectUser(this.project_key);
    const candidates = result.data
    candidates.forEach(item =>{
      const data = {}
      Object.keys(item).forEach((key) => {
        if (key.includes('start') || key.includes('end')){
          const value = this.getDateFormat(item[key]);
          data[key + '_format']= value;
          data[key] = item[key];
        } else {
          const value = item[key]
          data[key]= value;
        }
        data['employee_name'] = item['first_name'] + ' ' + item['last_name'];
        
      })
      this.list_candidate.push(data)
    })
    
    
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
    console.log(this.employeeList)
  }

  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase() + ' HH:mm');
    }
  }

  takeInputValue(value: string, form: string): void {
    if (value) {
      this.candidateEdit.controls[form].markAsDirty();
      this.candidateEdit.controls[form].setValue(value);
    } else {
      this.candidateEdit.controls[form].setValue(null);
    }
  }

  takeMasterValue(value: KeyValueDto[] | KeyValueDto, form: string): void {
    if (isObjectFull(value)) {
      this.candidateEdit.controls[form].markAsDirty();
      this.candidateEdit.controls[form].setValue(value[0]);
    } else {
      this.candidateEdit.controls[form].setValue(null);
    }
  }

  takeInputNumberValue(value: any, group: string, form: string) {  
    if (value !== '' && value !== null && !isNaN(value)) {
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(Number(value));
    } else {
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(null);
    }
  }

  takeDatePickerValue(value: number, group: string, form: string) {
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
    }else{
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(null);
    }
  }

}
