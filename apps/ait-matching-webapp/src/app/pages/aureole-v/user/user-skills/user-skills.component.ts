import { UserSkillsService } from './../../../../services/user-skills.service';
import { AitAppUtils, AitAuthService, AitBaseComponent, AitConfirmDialogComponent, AitEnvironmentService, AppState, MODE } from '@ait/ui';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { isObjectFull, KEYS, RESULT_STATUS } from '@ait/shared';

@Component({
  selector: 'ait-user-skills',
  templateUrl: './user-skills.component.html',
  styleUrls: ['./user-skills.component.scss']
})
export class UserSkillsComponent extends AitBaseComponent implements OnInit {
  dataSkill = [];
  mode = MODE.NEW;
  userSkills: FormGroup;
  userSkillsClone : any;
  companySkills = [];
  isChanged = false;
  sort_no = 0;
  user_skills = {
    _from: '',
    _to: '',
    relationship: '',
    sort_no: 0,
  };
  constructor(
    private userSkillsService : UserSkillsService,
    private formBuilder: FormBuilder,
    layoutScrollService: NbLayoutScrollService,
    public activeRouter: ActivatedRoute,
    toastrService: NbToastrService,
    store: Store<AppState>,
    authService: AitAuthService,
    env: AitEnvironmentService,
    apollo: Apollo,
    private router: Router,
    private element: ElementRef,
    private dialogService: NbDialogService,
  ) {
    super(store, authService, apollo, null, env, layoutScrollService, toastrService);
    this.setModulePage({
      module: 'user',
      page: 'user_skills',
    });
    this.userSkills = this.formBuilder.group({
      skills: new FormControl(null, [Validators.required, Validators.maxLength(10)]),
    });
  }

  async ngOnInit(): Promise<void> {
    await this.findSkills();
    debugger
    await this.userSkills.valueChanges.subscribe((data) => {   
      this.checkAllowSave();
      console.log(this.isChanged);
      
    });
  }
  checkAllowSave() {
    const certificateInfo = { ...this.userSkills.value };
    const certificateClone = { ...this.userSkillsClone };
    // this.setHours(userInfo);
    
    const isChangedUserInfo = AitAppUtils.isObjectEqual(
      { ...certificateInfo },
      { ...certificateClone }
    );
    this.isChanged = !(isChangedUserInfo);
  }
  async findSkills(){
    const from = 'sys_user/' + this.user_id;
    await this.userSkillsService.findSkill(from).then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        if(res.data.length > 0){
          this.mode = MODE.EDIT;
          let listSkills = []
          res.data.forEach((key) =>{
            listSkills.push({_key:key._to.substring(8)} );
          })
          this.userSkills.controls['skills'].setValue(listSkills);
          this.companySkills = listSkills;
          this.userSkillsClone = this.userSkills.value;     
        }else{
          this.userSkillsClone = this.userSkills.value;
        }
      }
      
    })
    
  }

  async saveAndContinue(){
    this.user_skills._from = 'sys_user/' + this.user_id;
    this.user_skills.relationship = 'sys_user m_skill';
    if(this.mode == 'EDIT'){
      const _fromSkill = [
        { _from: 'sys_user/' + this.user_id },
      ];
      this.userSkillsService.removeUserSkill(_fromSkill);
    }
    
    const listSkills = this.userSkills.value.skills;
    listSkills.forEach(async (skill) => {
      this.sort_no += 1;
      this.user_skills.sort_no = this.sort_no;
      this.user_skills._to = 'm_skill/' + skill._key;

      await this.userSkillsService.saveSkills(this.user_skills)
      .then((res) => {
        if (res?.status === RESULT_STATUS.OK){
          const message =
          this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
          this.showToastr('', message);
          this.router.navigateByUrl('/user-skills');
        }else{
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }
      }).catch(() => {
        this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
      }); 
    });
  }

  async saveAndClose(){
    this.user_skills._from = 'sys_user/' + this.user_id;
    this.user_skills.relationship = 'sys_user m_skill';
    if(this.mode == 'EDIT'){
      const _fromSkill = [
        { _from: 'sys_user/' + this.user_id },
      ];
      this.userSkillsService.removeUserSkill(_fromSkill);
    }
    const listSkills = this.userSkills.value.skills;
    listSkills.forEach(async (skill) => {
      this.sort_no += 1;
      this.user_skills.sort_no = this.sort_no;
      this.user_skills._to = 'm_skill/' + skill._key;
      
      await this.userSkillsService.saveSkills(this.user_skills)
      .then((res) =>{
        if (res?.status === RESULT_STATUS.OK){
          const message =
          this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
          this.showToastr('', message);
          this.router.navigateByUrl('/');
        }else{
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }
      }).catch(() => {
        this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
      }); ;
    });
  }

  async cancel(){

  }

  scrollIntoError() {
      for (const key of Object.keys(this.userSkills.controls)) {
        if (this.userSkills.controls[key].invalid) {
          let invalidControl = this.element.nativeElement.querySelector(
            `#${key}_input`
          );
          if(key == 'file'){
              invalidControl = this.element.nativeElement.querySelector(
              `#${key}_input_file`
            );      
          }
          try {
            invalidControl.scrollIntoView({
              behavior: 'auto',
              block: 'center',
            });
            break;
          } catch {}
        }
      }
    }

  takeMasterValue(val: any, form: string): void { 
    console.log(val.value);
    
    if (val) {
      if(isObjectFull(val)  && val.value.length > 0 ){          
        const data = [];       
        val.value.forEach((item) => {
          data.push(item);
        });
        this.userSkills.controls[form].markAsDirty();
        this.userSkills.controls[form].setValue(data);                        
      }
    }else{
      this.userSkills.controls[form].markAsDirty();
      this.userSkills.controls[form].setValue(null);
    }    
        
  }

  back(){   
    if(this.isChanged){
      this.dialogService
      .open(AitConfirmDialogComponent, {
        closeOnBackdropClick: true,
        hasBackdrop: true,
        autoFocus: false,
        context: {
          title: this.getMsg('I0006'),
        },
      })
      .onClose.subscribe(async (event) => {
        if (event) {
          history.back()
        }
      });
    }else{
      history.back()
    }
  }

  getTitleByMode() {   
    let title = ""; 
    if(this.mode === MODE.NEW){
      title = "Add skills";
    } 
    if(this.mode === MODE.EDIT){
      title = "Edit skills";
    }
    return title;
  }

}
