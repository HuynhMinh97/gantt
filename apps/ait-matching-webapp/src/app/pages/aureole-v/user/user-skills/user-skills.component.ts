import {
  MODE,
  AppState,
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitConfirmDialogComponent,
} from '@ait/ui';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Component, OnInit, Optional } from '@angular/core';
import { isObjectFull, KEYS, RESULT_STATUS } from '@ait/shared';
import { UserSkillsService } from './../../../../services/user-skills.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { UserProfileService } from '../../../../services/user-profile.service';
import { UserReoderSkillsService } from '../../../../services/user-reoder-skills.service';

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
  userSkillsClone: any;
  isSave = false;
  isChanged = false;
  sort_no = 0;
  user_skills = {
    _from: '',
    _to: '',
    relationship: '',
    sort_no: 0,
  };
  topSkills: any[];
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
    private dialogService: NbDialogService,
    private userSkillsService: UserSkillsService,
    private userProfileService: UserProfileService,
    private reoderSkillsService: UserReoderSkillsService,
    @Optional() private nbDialogRef: NbDialogRef<AitConfirmDialogComponent>,
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

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
          this.closeDialog(false);
      }
    });

    this.userSkills = this.formBuilder.group({
      skills: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
    });
  }

  async ngOnInit(): Promise<void> {
    this.callLoadingApp();
    await this.findSkills();
    this.findTopSkills();
    this.userSkills.valueChanges.subscribe((data) => {
      this.checkAllowSave();
    });
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

  async findTopSkills(){
    await this.userProfileService.findTopSkill(this.user_id)
      .then((res) => {
        const data = res.data[0]; 
        this.topSkills = [];
        this.topSkills = data.top_skills ? data.top_skills : [];
      })
  }

  async findSkills() {
    const from = 'sys_user/' + this.user_id;
    await this.userSkillsService.findSkill(from).then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        if (res.data.length > 0) {
          this.mode = MODE.EDIT;
          const listSkills = []
          for (const item of res.data) {
            listSkills.push(item.skills)
          }
          this.userSkills.controls['skills'].setValue(listSkills);
          this.companySkills = listSkills
          this.userSkillsClone = this.userSkills.value;
          this.cancelLoadingApp();
        } else {
          this.userSkillsClone = this.userSkills.value;
          this.cancelLoadingApp();
        }
      }
    })
  }

  async saveAndContinue() {
    if (this.userSkills.valid) {
      this.callLoadingApp();
      this.user_skills._from = 'sys_user/' + this.user_id;
      this.user_skills.relationship = 'user_skill';
      if (this.mode == 'EDIT') {
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
            if (res?.status === RESULT_STATUS.OK) {
              console.log(listSkills);              
              this.isSave = true;
              const message = this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
              this.showToastr('', message);
              this.isChanged = false;
              this.cancelLoadingApp();
            } else {
              this.cancelLoadingApp();
              this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
            }
          }).catch(() => {
            this.cancelLoadingApp();
            this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
          });
      });
    } else {
      this.cancelLoadingApp();
    }
  }

  updateTopSkill(){
    const topSkills = [];
    const listSkills = this.userSkills.value.skills;
    this.topSkills.forEach((item) =>{
      const isSkill = listSkills.find(skill => skill._key == item._key)
      if(isSkill){
        topSkills.push(isSkill._key);     
      }
    })
    const data = [{ top_skills: topSkills }]
    this.reoderSkillsService.updateTopSkill(data);
  }

  async saveAndClose() {
    if (this.userSkills.valid ) {
      this.callLoadingApp();
      this.user_skills._from = 'sys_user/' + this.user_id;
      this.user_skills.relationship = 'user_skill';
      if (this.mode == 'EDIT') {
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
            if (res?.status === RESULT_STATUS.OK) {
              const message = this.mode === 'NEW' ? this.getMsg('I0001') : this.getMsg('I0002');
              this.showToastr('', message);
              this.closeDialog(true);
            } else {
              this.cancelLoadingApp();
              this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
            }
          }).catch(() => {
            this.cancelLoadingApp()
            this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
          });;
      });
      this.updateTopSkill();
      this.cancelLoadingApp();
    } else {
      this.cancelLoadingApp();
    }
  }

  takeMasterValue(val: any, form: string): void {
    if (val.value.length > 0) {
      if (isObjectFull(val) && val.value.length > 0) {
        const data = [];
        val.value.forEach((item) => {
          data.push(item);
        });
        this.userSkills.controls[form].markAsDirty();
        this.userSkills.controls[form].setValue(data);
      }
    } else {
      this.userSkills.controls[form].markAsDirty();
      this.userSkills.controls[form].setValue(null);
    }

  }

  back() {
    if (this.isChanged) {
      this.dialogService
        .open(AitConfirmDialogComponent, {
          closeOnBackdropClick: true,
          hasBackdrop: true,
          autoFocus: false,
          context: {
            style: {width: '90%'},
            title: this.getMsg('I0006'),
          },
        })
        .onClose.subscribe(async (event) => {
          if (event) {
            this.closeDialog(false);
          }
        });
    } else {
      if (this.isSave) {
        this.closeDialog(true);
      } else {
        this.closeDialog(false);
      }

    }
  }

  closeDialog(event: boolean) {
    this.nbDialogRef.close(event);
  }

}
