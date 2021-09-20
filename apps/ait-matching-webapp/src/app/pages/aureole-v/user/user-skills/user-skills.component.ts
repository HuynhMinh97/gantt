import { UserSkillsService } from './../../../../services/user-skills.service';
import { AitAuthService, AitBaseComponent, AitEnvironmentService, AppState, MODE } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { isObjectFull } from '@ait/shared';

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
  async saveSkill() {
    this.user_skills._from = 'sys_user/' + this.user_id;
    this.user_skills.relationship = 'sys_user m_skill';
    // if(this.mode == 'EDIT'){
    //   const _fromSkill = [
    //     { _from: 'sys_user/' + this.user_id },
    //   ];
    //   this.userSkillsService.removeSkill(_fromSkill);
    // }
    const listSkills = this.userSkills.value.skills;
    debugger
    listSkills.forEach(async (skill) => {
      this.sort_no += 1;
      this.user_skills.sort_no = this.sort_no;
      this.user_skills._to = 'm_skill/' + skill._key;
      await this.userSkillsService.saveSkills(this.user_skills);
    });
  }
  takeMasterValue(val: any, form: string): void { 
    if (val) {
      if(isObjectFull(val)){          
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
