import { 
  MODE ,
  AppState, 
  AitAppUtils, 
  AitAuthService, 
  AitBaseComponent, 
  AitEnvironmentService, 
  AitConfirmDialogComponent, 
} from '@ait/ui';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit } from '@angular/core';
import { isObjectFull, KEYS, RESULT_STATUS } from '@ait/shared';
import { UserSkillsService } from './../../../../services/user-skills.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbLayoutScrollService, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ait-user-skills',
  templateUrl: './user-skills.component.html',
  styleUrls: ['./user-skills.component.scss']
})
export class UserSkillsComponent extends AitBaseComponent implements OnInit {
  userSkills: FormGroup;
  mode = MODE.NEW;
  dataSkill = [];
  companySkills = [];
  userSkillsClone : any;
  isSave = false;
  isChanged = false;
  sort_no = 0;
  user_skills = {
    _from: '',
    _to: '',
    relationship: '',
    sort_no: 0,
  };
  constructor(
    private element: ElementRef,
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
    private dialogService: NbDialogService,
    private userSkillsService : UserSkillsService,
    private nbDialogRef: NbDialogRef<AitConfirmDialogComponent>,
    layoutScrollService: NbLayoutScrollService,
    toastrService: NbToastrService,
    authService: AitAuthService,
    env: AitEnvironmentService,
    store: Store<AppState>,
    apollo: Apollo,
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

    this.setModulePage({
      module: 'user',
      page: 'user_skills',
    });

    this.userSkills = this.formBuilder.group({
      skills: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
    });
  }

  async ngOnInit(): Promise<void> {
    this.callLoadingApp();
    await this.findSkills();  
    await this.userSkills.valueChanges.subscribe((data) => {
      this.checkAllowSave();
    });
    this.cancelLoadingApp();
  }

  checkAllowSave() {
    const userSkill = { ...this.userSkills.value };
    const userSkillClone = { ...this.userSkillsClone };
    const isChangedUserInfo = AitAppUtils.isObjectEqual(
      { ...userSkill },
      { ...userSkillClone }
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
          for(let item of res.data){
            listSkills.push(item.skills)
          }
          this.userSkills.controls['skills'].setValue(listSkills);
          this.companySkills = listSkills
          this.userSkillsClone = this.userSkills.value;  
          this.cancelLoadingApp();           
        }else{
          this.userSkillsClone = this.userSkills.value;
        }
      }      
    })    
  }

  async saveAndContinue(){
    this.callLoadingApp();
    this.user_skills._from = 'sys_user/' + this.user_id;
    this.user_skills.relationship = 'user_skill';
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
          this.isSave = true;
          const message = this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
          this.showToastr('', message);
          this.isChanged = false;
          this.cancelLoadingApp();
        }else{
          this.cancelLoadingApp();
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }
      }).catch(() => {
        this.cancelLoadingApp();
        this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
      }); 
    });
  }

  async saveAndClose(){
    this.callLoadingApp();
    this.user_skills._from = 'sys_user/' + this.user_id;
    this.user_skills.relationship = 'user_skill';
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
          const message = this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
          this.showToastr('', message);          
          this.closeDialog(true);
        }else{
          this.cancelLoadingApp();
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }
      }).catch(() => {
        this.cancelLoadingApp()
        this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
      }); ;
    });
    this.cancelLoadingApp();
  }

  takeMasterValue(val: any, form: string): void {   
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
          this.closeDialog(false);
        }
      });
    }else{
      if(this.isSave){
        this.closeDialog(true);
      }else{
        this.closeDialog(false);
      }

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
  
  closeDialog(event: boolean) {
    this.nbDialogRef.close(event);
  }

}
