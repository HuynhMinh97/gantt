import { RegisterProjectService } from './../../services/register-project.service';
import { UserOnboardingService } from './../../services/user-onboarding.service';
import { AitAuthService, AitBaseComponent, AitEnvironmentService, AppState } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'ait-register-project',
  templateUrl: './register-project.component.html',
  styleUrls: ['./register-project.component.scss']
})
export class RegisterProjectComponent extends AitBaseComponent implements OnInit {
  project_key: string;
  projectForm: FormGroup;
  project_skill = [];
  userProjectClone: any;


  constructor(
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
    private userOnbService: UserOnboardingService,
    private registerProjectService: RegisterProjectService,


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

    this.projectForm = this.formBuilder.group({
      project_ait_name: new FormControl(null),
      _key: new FormControl(null),
      location: new FormControl(null),
      title: new FormControl(null, [Validators.required]),
      valid_time_from: new FormControl(null, [Validators.required]),
      valid_time_to: new FormControl(null, [Validators.required]),
      level: new FormControl(null, [Validators.required]),
      industry: new FormControl(null, [
        Validators.required,
        Validators.maxLength(200),
      ]),
      skills: new FormControl(null, [
        Validators.required,
        Validators.maxLength(10),
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.maxLength(4000),
      ]),
    });
  }

  ngOnInit(): void {
    this.project_key = this.activeRouter.snapshot.paramMap.get('id');

    this.cancelLoadingApp();
  }

  public find = async (data = {}) => {
    try {
      const dataFind = [];
      await this.findProjectByKey();
      await this.findSkillProject();
      await dataFind.push(this.projectForm.value);
      
      return { data: dataFind };
    } catch (error) {}
  };

  async findProjectByKey() {
    const res = await this.registerProjectService.findProjectAitByKey(this.project_key);
    const data = res.data[0];
    if (res.data.length > 0) {
    await  this.projectForm.patchValue({ ...data });
      this.userProjectClone = this.projectForm.value;
    } else {
      this.router.navigate([`/404`]);
    }
  }

  async findSkillProject() {
    const _key = this.project_key;
    await this.registerProjectService.findSkillProject(_key).then(async (res) => {
      const listSkills = [];
      for (const skill of res.data) {
        listSkills.push({
          _key: skill?.skills?._key,
          value: skill?.skills?.value,
        });
      }
      if(listSkills[0]['_key']){
        this.project_skill = listSkills;
        await this.projectForm.controls['skills'].setValue([
          ...listSkills,
        ]);
      }
    
      this.cancelLoadingApp();
    });
  }

}
