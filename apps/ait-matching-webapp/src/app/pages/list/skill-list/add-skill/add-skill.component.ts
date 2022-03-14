import { isArrayFull, isObjectFull, KEYS, RESULT_STATUS } from '@ait/shared';
import {
  AitAppUtils,
  AitAuthService,
  AitBaseComponent,
  AitConfirmDialogComponent,
  AitEnvironmentService,
  AppState,
  LOADINGAPP,
  MODE,
} from '@ait/ui';
import { Component, ElementRef, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { SkillListService } from '../../../../../services/skill-list.service';
import { SkillRegisterService } from '../../../../../services/add-skill.service';

@Component({
  selector: 'ait-add-skill',
  templateUrl: './add-skill.component.html',
  styleUrls: ['./add-skill.component.scss'],
})
export class AddSkillComponent extends AitBaseComponent implements OnInit {
  model: string;
  skill: FormGroup;
  skillClone: any;
  keyCoppy: string;
  skillKey: string;
  validate = false;
  isChanged = false;
  isCopy = false;
  done = false;
  isSubmit = false;
  listSkill: any[];
  checkExits = false;
  max_sort_no = 0;
  sort_no = 0;
  user_skills = {
    category: '',
    name: {},
    code: '',
    sort_no: 0,
    active_flag: true,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private element: ElementRef,
    private formBuilder: FormBuilder,
    private skillListService: SkillListService,
    private dialogService: NbDialogService,
    private skillRegisterService: SkillRegisterService,
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

    this.skill = this.formBuilder.group({
      category: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      code: new FormControl(null, [Validators.required]),
    });

    this.skillKey = this.activatedRoute.snapshot.paramMap.get('id');

    this.setModulePage({
      module: 'add-skill',
      page: 'add-skill',
    });

    
  }

  async ngOnInit(): Promise<void> {
    this.keyCoppy = this.skillRegisterService.copyKey;
    if (this.skillKey) {
      this.model = MODE.EDIT;
      this.getSkillByKey(this.skillKey);
    } else if (this.keyCoppy && this.isCopy) {
      this.model = MODE.NEW;
      this.isCopy = true;
      this.getSkillByKey(this.keyCoppy);
    } else {
      this.model = MODE.NEW;
    }
    this.max_sort_no = this.skillRegisterService.max_sort_no;
    this.listSkill = this.skillRegisterService.listSkill;
  }

  checkAllowSave() {
    const attributeInfo = { ...this.skill.value };
    const attributeClone = { ...this.skillClone };
    const isChangedUserInfo = AitAppUtils.isObjectEqual(
      { ...attributeInfo },
      { ...attributeClone }
    );
    this.isChanged = !isChangedUserInfo;
  }

  deleteByKey(){
    const _key = this.skillKey;
    this.dialogService.open(AitConfirmDialogComponent, {
      closeOnBackdropClick: true,
      hasBackdrop: true,
      autoFocus: false,
      context: {
        title: this.getMsg('I0004'),
      },
    })
      .onClose.subscribe(async (event) => {
        if (event) {
          await this.skillListService.removeSkillByKey(_key)
            .then((res) => {
              if (res.status === RESULT_STATUS.OK) {
                this.showToastr('', this.getMsg('I0003'));
                setTimeout(() => {
                  this.done = true;
                  this.router.navigate([`skill-list`]);
                }, 200)
                

              } else {
                this.showToastr('', this.getMsg('E0050'), KEYS.WARNING);
              }

            })
        }
      });
  }

  getSkillByKey(_key: string) {
    this.cancelLoadingApp();
    try {
      this.skillRegisterService.findSkillByKey(_key).then((res) => {
        const data = res.data[0];
        this.sort_no = data.sort_no
        this.skill.patchValue({ ...data });
        if (this.model == MODE.EDIT || this.keyCoppy) {
          this.skillClone = JSON.parse(JSON.stringify(this.skill.value));
        }
      });
      
    } catch (error) {
      this.callLoadingApp();
    }
  }

  takeInputValue(value: string, form: string): void {
    if (value) {
      this.skill.controls[form].markAsDirty();
      this.skill.controls[form].setValue(value);
      if (this.model == MODE.EDIT || this.keyCoppy) {
        this.checkAllowSave();
      }
    } else {
      this.skill.controls[form].setValue(null);
    }
  }

  takeMasterValue(value: any, target: string): void {
    if (isObjectFull(value)) {
      this.skill.controls[target].markAsDirty();
      this.skill.controls[target].setValue(
        isArrayFull(value) ? value[0] : value
      );
    } else {
      this.skill.controls[target].setValue(null);
    }
    if (this.model == MODE.EDIT || this.keyCoppy) {
      this.checkAllowSave();
    }
  }

  async reset() {
    this.isSubmit = false;
    this.isChanged = false;
    this.skill.patchValue({ ...this.skillClone });
    this.showToastr('', this.getMsg('I0007'));
  }

  async clear() {
    this.isSubmit = false;
    this.isChanged = false;
    this.skill.reset();
  }

  copy() {
    this.keyCoppy = this.skillKey;
    this.skillKey = null;
    this.sort_no = 0;
    this.isCopy = true;
    this.model = MODE.NEW;
  }

  async saveAPI() {
    this.isSubmit = true;
    if (this.skill.valid) {
      const category = this.skill.controls['category'].value;
      const code = this.skill.controls['code'].value;
      if (this.model === MODE.NEW) {
        this.listSkill.forEach((element) => {
          if (category.value === element?.category && code === element.code) {
            this.checkExits = true;
          }
        });
      }
      if (!this.checkExits) {
        this.max_sort_no += 1;
        const data = this.skill.value;
        const objName = {
          en_US: data.name,
          ja_JP: data.name,
          vi_VN: data.name,
        };
        data['active_flag'] = true;
        if (this.skillKey) {
          this.user_skills['_key'] = this.skillKey;
          this.user_skills.sort_no = this.sort_no;
        } else {
          this.user_skills.sort_no = this.max_sort_no;
        }
        this.user_skills.category = data.category._key;
        this.user_skills.name = objName;
        this.user_skills.code = data.code;
        this.user_skills.active_flag = data.active_flag;
        this.skillRegisterService
          .saveRegistSkill([this.user_skills])
          .then((res) => {
            if (res.status === RESULT_STATUS.OK) {
              this.showToastr('', this.getMsg('I0005'));
              this.router.navigate([`skill-list`]);
              this.cancelLoadingApp();
            } else {
              this.cancelLoadingApp();
              this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
            }
          });
      } else {
        this.cancelLoadingApp();
        this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        this.checkExits = false;
      }
    } else {
      this.scrollIntoError();
    }
  }

  scrollIntoError() {
    for (const key of Object.keys(this.skill.controls)) {
      if (this.skill.controls[key].invalid) {
        const invalidControl = this.element.nativeElement.querySelector(
          `#${key}_input`
        );
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

  cancelLoadingApp = () => {
    this.store.dispatch(new LOADINGAPP(false));
  };
}
