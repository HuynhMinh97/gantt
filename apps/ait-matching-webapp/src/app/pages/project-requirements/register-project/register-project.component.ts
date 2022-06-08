import { RegisterProjectService } from '../../../services/register-project.service';
import { UserOnboardingService } from '../../../services/user-onboarding.service';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AppState,
  getUserSetting,
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserListService } from '../../../services/user-list.service';
import { isObjectFull, RESULT_STATUS } from '@ait/shared';
import dayjs from 'dayjs';

@Component({
  selector: 'ait-register-project',
  templateUrl: './register-project.component.html',
  styleUrls: ['./register-project.component.scss'],
})
export class RegisterProjectComponent
  extends AitBaseComponent
  implements OnInit {
  project_key: string;
  projectForm: FormGroup;
  project_skill = [];
  dateFormat: string;

  userProjectClone: any;
  tableComponents: any[] = [1]
  isTableIncluded = true;
  isExpandIncluded = true;
  isExpan = true;
  isTableExpan = true;
  user_list = [];

  // settings = {
  //   selectMode: 'multi',
  //   edit: {
  //     editButtonContent: '<span>Edit</span>',
  //     saveButtonContent: '<span>Save</span>',
  //     cancelButtonContent: '<span>Cancel</span>',
  //     confirmSave: true,
  //   },
  //   /**
  //    * TODO: Enable add/delete actions
  //    */
  //   actions: {
  //     add: false,
  //     delete: false,
  //     columnTitle: '', // minimize the actions column size
  //   },
  //   columns: {
  //     name: {
  //       title: 'Name',
  //       type: 'html',
  //     editor: {
  //       type: 'list',
  //       config: {
  //         list: [...this.user_list]
  //       },
  //     }
  //     },
  //     start_plan: {
  //       title: 'Start plan',
  //       editor: {
  //         type: 'input',
  //       },
  //     },
  //     end_plan: {
  //       title: 'End Plan',
  //       editor: {
  //         type: 'input',
  //       },
  //     },
  //     remark: {
  //       title: 'Remark',
  //       editor: {
  //         type: 'input',
  //       },
  //     },
  //   },
  // };

  data = [
    {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
    },
    {
      id: 2,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
    },
    {
      id: 3,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
    },
    {
      id: 4,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    public activeRouter: ActivatedRoute,
    private userOnbService: UserOnboardingService,
    private registerProjectService: RegisterProjectService,
    private userListService: UserListService,


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
      remark: new FormControl(null, [
        Validators.required,
        Validators.maxLength(4000),
      ]),
    });
  }

  async ngOnInit(): Promise<void> {
    this.project_key = this.activeRouter.snapshot.paramMap.get('id');
    await this.getAllUser();
    console.log(this.user_list)
    this.cancelLoadingApp();
  }

  onCreateConfirm(event) {
    console.log('Create Event In Console');
    console.log(event);
    event.confirm.resolve();
  }

  onSaveConfirm(event) {
    console.log('Edit Event In Console');
    console.log(event);
    event.confirm.resolve();
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
    const res = await this.registerProjectService.findProjectAitByKey(
      this.project_key
    );
    const data = res.data[0];
    if (res.data.length > 0) {
      await this.projectForm.patchValue({ ...data });
      this.userProjectClone = this.projectForm.value;
    } else {
      this.router.navigate([`/404`]);
    }
  }

  async findSkillProject() {
    const _key = this.project_key;
    await this.registerProjectService
      .findSkillProject(_key)
      .then(async (res) => {
        const listSkills = [];
        for (const skill of res.data) {
          listSkills.push({
            _key: skill?.skills?._key,
            value: skill?.skills?.value,
          });
        }
        if (listSkills[0]['_key']) {
          this.project_skill = listSkills;
          await this.projectForm.controls['skills'].setValue([...listSkills]);
        }

        this.cancelLoadingApp();
      });
  }

  toggleExpan = () => (this.isExpan = !this.isExpan);
  toggleTableExpan = () => (this.isTableExpan = !this.isTableExpan);

  async getAllUser() {
    const dataSearch = [];
    await this.userListService.find().then((res) => {
      if (res.status === RESULT_STATUS.OK) {
        const data = res.data;
        if (data.length > 0) {
          data.forEach(async (element) => {
            const dataFormat = {};
            dataFormat['title'] = element?.username;
            dataFormat['value'] = element?._key;
            dataSearch.push(dataFormat);
          });
        }
      }
    });
    this.user_list = dataSearch;
    return dataSearch;
  }

  // getDateFormat(time: number) {
  //   if (!time) {
  //     return '';
  //   } else {
  //     return dayjs(time).format(this.dateFormat.toUpperCase() + ' HH:mm');
  //   }
  // }
}
