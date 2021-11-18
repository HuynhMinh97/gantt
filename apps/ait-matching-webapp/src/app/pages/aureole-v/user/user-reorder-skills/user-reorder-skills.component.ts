import { Component, ElementRef, OnInit } from '@angular/core';
import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { OrderSkill, SkillsDto, UserSkill, } from './user-reorder-skills';
import { KEYS, RESULT_STATUS } from '@ait/shared';
import { AitAppUtils, AitAuthService, AitBaseComponent, AitConfirmDialogComponent, AitEnvironmentService, AppState } from '@ait/ui';
import { UserReoderSkillsService } from 'apps/ait-matching-webapp/src/app/services/user-reoder-skills.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Apollo } from 'apollo-angular';
import { Store } from '@ngrx/store';

@Component({
  selector: 'ait-user-reorder-skills',
  templateUrl: './user-reorder-skills.component.html',
  styleUrls: ['./user-reorder-skills.component.scss']
})
export class UserReorderSkillsComponent extends AitBaseComponent implements OnInit {
  connecteDto = [];
  reorderSkills: OrderSkill[] = [];
  listSkills: SkillsDto[] = [];
  listTopSkills: SkillsDto[] = [];
  isChanged = false;
  reorderSkillsClone: OrderSkill[] = [];
  sort_no = 0;
  user_skills = {
    _from: '',
    _to: '',
    relationship: '',
    sort_no: 0,
  };

  constructor(
    private nbDialogRef: NbDialogRef<AitConfirmDialogComponent>,
    private reoderSkillsService: UserReoderSkillsService,
    public activeRouter: ActivatedRoute,
    toastrService: NbToastrService,
    authService: AitAuthService,
    env: AitEnvironmentService,
    apollo: Apollo,
    private router: Router,
    private element: ElementRef,
    private dialogService: NbDialogService,
    store: Store<AppState>,
    layoutScrollService: NbLayoutScrollService,
  ) {
    super(store, authService, apollo, null, env, layoutScrollService, toastrService);
    this.setModulePage({
      module: 'user',
      page: 'user_skills',
    });
  }

  async ngOnInit(): Promise<void> {
    this.callLoadingApp();
    await this.findTopSkills();
    await this.findSkills();
    await this.groupSkill();
    this.reorderSkills.forEach((element) => {
      this.connecteDto.push(element.name);
    })
  }

  checkAllowSave() {
    const reorder = { ...JSON.parse(JSON.stringify(this.reorderSkills)) };
    const reorderClone = { ...this.reorderSkillsClone };
    const isChangedUserInfo = this.isObjectEqual(
      { ...reorder },
      { ...reorderClone }
    );
    this.isChanged = !(isChangedUserInfo);
  }

  isObjectEqual = (obj1: any, clone: any) => {
    debugger
    const obj2 = { ...clone };
    let checked = true;
    for (const prop in obj1) {
      if(obj1[prop].data.length != obj2[prop].data.length){
        checked = false;
      }
      if(obj1[prop].name == "TOP5"){
        const isChangedUserInfo = AitAppUtils.isObjectEqual(
          { ...obj1[prop] },
          { ...obj2[prop] }
        );
      }
    }
    return checked
  }
  
  evenPredicate(item: CdkDrag<string>) {
    if (item.data != "TOP5") {
      return true;
    } else {
      return false;
    }

  }

  async findTopSkills() {
    await this.reoderSkillsService.findTopSkills(this.user_id)
      .then((res) => {
        if (res.status === RESULT_STATUS.OK) {
          const data = res.data[0].top_skills;
          if (data) {
            data.forEach(element => {
              const topSkills = {} as SkillsDto;
              topSkills.category = "TOP5";
              topSkills.name = element.value;
              topSkills._key = element._key;
              this.listTopSkills.push(topSkills);
            });
          } else {
            const topSkills = {} as SkillsDto;
            topSkills.category = "TOP5";
            this.listTopSkills.push(topSkills);
          }
        }
      })
  }
  async findSkills() {
    const from = 'sys_user/' + this.user_id;
    await this.reoderSkillsService.findReorder(from).then(async (res) => {
      if (res.status === RESULT_STATUS.OK) {
        if (res.data.length > 0) {
          res.data.forEach(element => {
            const skills = {} as SkillsDto;
            let isTop = false;
            this.listTopSkills.forEach((top) => {
              if (element._key == top._key) {
                isTop = true;
              }
            })
            if (isTop) {
              skills.top_skill = true;
              skills._key = element._key;
              skills.name = element.name;
              skills.category = element.category;
            } else {
              skills.top_skill = false;
              skills._key = element._key;
              skills.name = element.name;
              skills.category = element.category;
            }
            this.listSkills.push(skills);
          });
        }
      }

    })

  }


  async groupSkill() {
    if (this.reorderSkills.length == 0) {
      const dataSkills = {} as OrderSkill;
      dataSkills.name = 'TOP5';
      dataSkills.data = [];
      this.reorderSkills.push(dataSkills);
    }
    for (let skills of this.listSkills) {
      if (skills.top_skill) {
        let isCategory = true;
        //  tim category top 5 de them vao
        for (let i = 0; i < this.reorderSkills.length; i++) {
          if (this.reorderSkills[i].name == "TOP5") {
            this.reorderSkills[i].data.push(skills);
            break;
          }
        }
        // kiem tra category co ton tai ko
        for (let i = 0; i < this.reorderSkills.length; i++) {
          if (skills.category == this.reorderSkills[i].name) {
            isCategory = true;
            break;
          } else {
            isCategory = false;
          }
        }
        // neu ko ton tai thi them moi
        if (!isCategory) {
          const dataSkills = {} as OrderSkill;
          dataSkills.name = skills.category;
          dataSkills.data = [];
          this.reorderSkills.push(dataSkills);
        }
      } else {
        let isCategory = true;
        // kiem tra category ton tai neu ton tai thi them db vao    
        for (let i = 0; i < this.reorderSkills.length; i++) {
          if (skills.category == this.reorderSkills[i].name) {
            isCategory = true;
            this.reorderSkills[i].data.push(skills);
            break;
          } else {
            isCategory = false;
          }
        }
        // neu chua ton tai thi tao va them db vao
        if (!isCategory) {
          const dataSkills = {} as OrderSkill;
          dataSkills.name = '';
          dataSkills.data = [];
          dataSkills.name = skills.category;
          dataSkills.data.push(skills);
          this.reorderSkills.push(dataSkills);
        }
      }

    }
    this.cancelLoadingApp();
    this.reorderSkillsClone = JSON.parse(JSON.stringify(this.reorderSkills));
  }

  drop(event: CdkDragDrop<string[]>, category: OrderSkill) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.checkAllowSave();
    } else {
      if (event.container.id == "TOP5") {
        if (this.reorderSkills[0].data.length < 5) {
          transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          this.reorderSkills[0].data[event.currentIndex].top_skill = true;
          this.checkAllowSave();
        } else {
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }
      } else if (event.previousContainer.id == "TOP5") {
        const skill = this.reorderSkills[0].data[event.previousIndex];
        this.reorderSkills[0].data.splice(event.previousIndex, 1);
        for (let item in this.reorderSkills) {
          if (this.reorderSkills[item].name == skill.category) {
            this.reorderSkills[item].data.push(skill);
          }
        }
        this.checkAllowSave();
      } else {
        return false;
      }
    }
  }

  deleteSkill(category: OrderSkill, skill: SkillsDto) {
    for (let i in this.reorderSkills) {
      if (this.reorderSkills[i].name == category.name) {
        const listSkill = this.reorderSkills[i].data;
        listSkill.forEach((element, index) => {
          if (element == skill) { // tim kiem skill trung thi xoa
            this.reorderSkills[i].data.splice(index, 1);
          }
        })
      }
    }
    this.checkAllowSave();
  }

  removeSkill(category: OrderSkill, skill: SkillsDto) {
    if (category.name == "TOP5") {
      for (let i in this.reorderSkills) {
        if (this.reorderSkills[i].name == category.name) {
          const listSkill = this.reorderSkills[i].data;
          listSkill.forEach((element, index) => {
            if (element == skill) { // skill trung thi xoa
              this.reorderSkills[i].data.splice(index, 1);
            }
          })
        }
        if (this.reorderSkills[i].name == skill.category) {
          skill.top_skill = false;
          this.reorderSkills[i].data.push(skill);
        }
      }
      this.checkAllowSave();
    } else {
      this.dialogService
        .open(AitConfirmDialogComponent, {
          closeOnBackdropClick: true,
          hasBackdrop: true,
          autoFocus: false,
          context: {
            title: this.getMsg('I0004'),
          },
        })
        .onClose.subscribe(async (event) => {
          if (event) {
            this.deleteSkill(category, skill);
            this.checkAllowSave();
          }
        });
    }
  }

  passToChange(skill: SkillsDto, category: OrderSkill) {
    if (category.name === "TOP5") {
      this.removeSkill(category, skill);
      this.checkAllowSave();
    } else {
      for (let index in this.reorderSkills) {
        if (this.reorderSkills[index].name == "TOP5" && this.reorderSkills[index].data.length < 5) {
          skill.top_skill = true;
          this.reorderSkills[index].data.push(skill);
          this.deleteSkill(category, skill);
          break;
        }
        if (this.reorderSkills[index].name == "TOP5" && this.reorderSkills[index].data.length >= 5) {
          this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
        }
      }
      this.checkAllowSave();
    }
  }

  async save() {
    this.callLoadingApp();
    let listTop = [];
    this.user_skills._from = 'sys_user/' + this.user_id;
    this.user_skills.relationship = 'user_skill';
    const _fromSkill = [
      { _from: 'sys_user/' + this.user_id },
    ]
    this.reoderSkillsService.removeUserSkillReorder(_fromSkill);
    for (let category of this.reorderSkills) {
      for (let skill of category.data) {
        this.sort_no += 1;
        this.user_skills.sort_no = this.sort_no;
        this.user_skills._to = 'm_skill/' + skill._key;
        await this.reoderSkillsService.saveUserSkillReorder(this.user_skills)
          .then((res) => {
            if (res?.status === RESULT_STATUS.OK) {
              if (skill.top_skill) {
                listTop.push(skill._key);
              }
            }
            else {
              this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
            }
          });
      }
    }
    let data = [{ top_skills: listTop }]
    this.reoderSkillsService.updateTopSkill(data).then((res) => {
      if (res?.status === RESULT_STATUS.OK) {
        this.cancelLoadingApp();
        this.showToastr('', this.getMsg('I0002'));
        this.closeDialog(true);
      } else {
        this.showToastr('', this.getMsg('E0100'), KEYS.WARNING);
      }
    });
  }

  cancel() {
    if (this.isChanged) {
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
    } else {
      this.closeDialog(false);
    }
  }
  closeDialog(event: boolean) {
    this.nbDialogRef.close(event);
  }
}
