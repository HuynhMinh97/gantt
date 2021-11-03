import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AitAuthService, AitBaseComponent, AitEnvironmentService, AppState } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'ait-user-job-alert',
  templateUrl: './user-job-alert.component.html',
  styleUrls: ['./user-job-alert.component.scss']
})
export class UserJobAlertComponent extends AitBaseComponent implements OnInit {
  userjobAlert: FormGroup;
  isSubmit = false;
  mode = "NEW";
  isChanged = false;
  errorArr = [];
  resetuserjobAlert = {
    industry:false,
    experience_level:false,
    employee_type:false,
    location: false,
    start_date_from: false,
    start_date_to: false,
    salary_from: false, 
    salary_to: false,
  }
  constructor( store: Store<AppState>,
    authService: AitAuthService,
    apollo: Apollo,
    env: AitEnvironmentService,
    layoutScrollService: NbLayoutScrollService,
    toastrService: NbToastrService,
    private formBuilder: FormBuilder,
  ) {   
    super(store, authService, apollo, null, env, layoutScrollService,toastrService);
    this.setModulePage({
      module: 'user',
      page: 'user_experience',
    });
    this.userjobAlert = this.formBuilder.group({
      industry: new FormControl(null),
      experience_level: new FormControl(null),
      employee_type: new FormControl(null),
      location: new FormControl(null),
      start_date_from: new FormControl(null),
      start_date_to: new FormControl(null),
      salary_from: new FormControl(null),
      salary_to: new FormControl(null),
    })
  }
  
  ngOnInit(): void {
  }
  takeMasterValue(value: any, target: string): void {
   
  }
  takeDatePickerValue(value: number, group: string, form: string) {
    if (value == null) {
      this.isChanged = true;
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
    }
    if (value) {
      const data = value as number;
      value = new Date(data).setHours(0, 0, 0, 0);
      this[group].controls[form].markAsDirty();
      this[group].controls[form].setValue(value);
    }
  }
  takeInputValue(value: string, form: string): void {
    if (value) {
      this.userjobAlert.controls[form].markAsDirty();
      this.userjobAlert.controls[form].setValue(value);
    } else {
      this.userjobAlert.controls[form].setValue(null);
    }
  }

}
