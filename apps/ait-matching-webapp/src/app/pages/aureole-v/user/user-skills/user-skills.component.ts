import { UserSkillsService } from './../../../../services/user-skills.service';
import { AitAuthService, AitBaseComponent, AitEnvironmentService, AppState, MODE } from '@ait/ui';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { isObjectFull, KEYS, RESULT_STATUS } from '@ait/shared';

@Component({
  selector: 'ait-user-skills',
  templateUrl: './user-skills.component.html',
  styleUrls: ['./user-skills.component.scss']
})
export class UserSkillsComponent extends AitBaseComponent implements OnInit {
  mode = MODE.NEW;
  userSkills: FormGroup;
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

  ngOnInit(): void {
    this.findSkills();
  }
  async findSkills(){
    const from = 'sys_user/' + this.user_id;
    await this.userSkillsService.findSkill(from).then((res) => {
      if(res.data.length > 0){
        this.mode = MODE.EDIT;
        let listSkills = []
        res.data.forEach((key) =>{
          listSkills.push({_key:key._to.substring(8)} );
        })
        this.userSkills.controls['skills'].setValue(listSkills);
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

        }else{
          
        }
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
    console.log(val);
    
    if (val) {
      if(isObjectFull(val)  && val.length > 0 ){          
        const data = [];       
        val.value.forEach((item) => {
          data.push(item);
        });
        this.userSkills.controls[form].setValue(data);                        
      }
    }else{
      this.userSkills.controls[form].setValue(null);
    }   
    console.log(this.userSkills.value);
         
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
