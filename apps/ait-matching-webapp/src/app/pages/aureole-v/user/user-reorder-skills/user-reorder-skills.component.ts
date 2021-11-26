import { Component, ElementRef, OnInit } from '@angular/core';
import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { OrderSkill, SkillsDto} from './user-reorder-skills';
import { KEYS, RESULT_STATUS } from '@ait/shared';
import { AitAppUtils, AitAuthService, AitBaseComponent, AitConfirmDialogComponent, AitEnvironmentService, AppState } from '@ait/ui';
import { UserReoderSkillsService } from '../../../../services/user-reoder-skills.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
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

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
          this.closeDialog(false);
      }
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
    const obj2 = { ...clone };
    let checked = true;
    for (const prop in obj1) {
      if(obj1[prop].data.length != obj2[prop].data.length){
        checked = false;
        return checked;
      }else{
        const skillInfoClone = { ...obj1[prop] };
        const skillInfo = { ...obj2[prop]};
        const isChangedUserInfo = AitAppUtils.isObjectEqual(
          { ...skillInfoClone },
          { ...skillInfo }
        );
        checked = isChangedUserInfo;          
        if(!checked){
          return checked;
        }       
      }     
    }
    return checked;
  }
  
  evenPredicate(item: CdkDrag<string>) {
    if (item.data != 'TOP5') {
      return true;
    } else {
      return false;
    }

  }
  //get top skill in profile
  async findTopSkills() {
    await this.reoderSkillsService.findTopSkills(this.user_id)
      .then((res) => {
        if (res.status === RESULT_STATUS.OK) {
          const data = res.data[0].top_skills;
          if (data) {
            data.forEach(element => {
              const topSkills = {} as SkillsDto;
              topSkills.categoryName = 'TOP5';
              topSkills.name = element.value;
              topSkills._key = element._key;
              this.listTopSkills.push(topSkills);
            });
          } else {
            const topSkills = {} as SkillsDto;
            topSkills.categoryName = 'TOP5';

            this.listTopSkills.push(topSkills);
           
            
          }
          console.log(this.listTopSkills);
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
              skills.categoryName = element.category?.value;
              skills.categoryCode = element.category?._key;
            } else {
              skills.top_skill = false;
              skills._key = element._key;
              skills.name = element.name;
              skills.categoryName = element.category?.value;
              skills.categoryCode = element.category?._key;
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
      dataSkills.code = 'top5';
      dataSkills.name = 'TOP5';
      dataSkills.data = [];
      this.reorderSkills.push(dataSkills);
    }
    for (const skills of this.listSkills) {
      if (skills.top_skill) {
        let isCategory = true;
        //  tim category top 5 de them vao
        for (let i = 0; i < this.reorderSkills.length; i++) {
          if (this.reorderSkills[i].code == 'top5') {
            this.reorderSkills[i].data.push(skills);
            break;
          }
        }
        // kiem tra category co ton tai ko
        for (let i = 0; i < this.reorderSkills.length; i++) {
          if (skills.categoryCode == this.reorderSkills[i].code) {
            isCategory = true;
            break;
          } else {
            isCategory = false;
          }
        }
        // neu ko ton tai thi them moi
        if (!isCategory) {
          const dataSkills = {} as OrderSkill;
          dataSkills.name = skills.categoryName;
          dataSkills.code = skills.categoryCode;
          dataSkills.data = [];
          this.reorderSkills.push(dataSkills);
        }
      } else {
        let isCategory = true;
        // kiem tra category ton tai neu ton tai thi them db vao    
        for (let i = 0; i < this.reorderSkills.length; i++) {
          if (skills.categoryCode == this.reorderSkills[i].code) {
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
          dataSkills.name = skills.categoryName;
          dataSkills.code = skills.categoryCode;
          dataSkills.data.push(skills);
          this.reorderSkills.push(dataSkills);
        }
      }

    }
    this.cancelLoadingApp();
    this.reorderSkills.forEach((element,index) => {
      if(element.code == 'OTHERS'){
        this.reorderSkills.push(element);
        this.reorderSkills.splice(index, 1 );
      }
    });
    console.log(this.listSkills);
    
    this.reorderSkillsClone = JSON.parse(JSON.stringify(this.reorderSkills));
  }

  drop(event: CdkDragDrop<string[]>, category: OrderSkill) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.checkAllowSave();
    } else {
      if (event.container.id == 'TOP5') {
        if (this.reorderSkills[0].data.length < 5) {
          transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          this.reorderSkills[0].data[event.currentIndex].top_skill = true;
          this.checkAllowSave();
        } else {
          this.showToastr('', this.getMsg('E0021'), KEYS.WARNING);
        }
      } else if (event.previousContainer.id == 'TOP5') {
        const skill = this.reorderSkills[0].data[event.previousIndex];
        skill.top_skill = false;
        this.reorderSkills[0].data.splice(event.previousIndex, 1);
        for (const item in this.reorderSkills) {
          if (this.reorderSkills[item].code == skill.categoryCode) {
            this.reorderSkills[item].data.splice(event.currentIndex, 0, skill);
          }
        }
        this.checkAllowSave();
      } else {
        return false;
      }
    }
  }

  deleteSkill(category: OrderSkill, skill: SkillsDto) {
    for (const i in this.reorderSkills) {
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
    if (category.name == 'TOP5') {
      for (const i in this.reorderSkills) {
        if (this.reorderSkills[i].name == category.name) {
          const listSkill = this.reorderSkills[i].data;
          listSkill.forEach((element, index) => {
            if (element == skill) { // skill trung thi xoa
              this.reorderSkills[i].data.splice(index, 1);
            }
          })
        }
        if (this.reorderSkills[i].code == skill.categoryCode) {
          skill.top_skill = false;
          this.reorderSkills[i].data.push(skill);
        }
      }
      this.checkAllowSave();
    } else {
      this.deleteSkill(category, skill);
      this.checkAllowSave();
    }
  }

  passToChange(skill: SkillsDto, category: OrderSkill) {
    if (category.name === 'TOP5') {
      this.removeSkill(category, skill);
      this.checkAllowSave();
    } else {
      for (const index in this.reorderSkills) {
        if (this.reorderSkills[index].name == 'TOP5' && this.reorderSkills[index].data.length < 5) {
          skill.top_skill = true;
          this.reorderSkills[index].data.push(skill);
          this.deleteSkill(category, skill);
          break;
        }
        if (this.reorderSkills[index].name == 'TOP5' && this.reorderSkills[index].data.length >= 5) {
          this.showToastr('', this.getMsg('E0021'), KEYS.WARNING);
        }
      }
      this.checkAllowSave();
    }
  }

  async save() {
    this.callLoadingApp();
    const listTop = [];
    this.user_skills._from = 'sys_user/' + this.user_id;
    this.user_skills.relationship = 'user_skill';
    const _fromSkill = [
      { _from: 'sys_user/' + this.user_id },
    ]
    this.reoderSkillsService.removeUserSkillReorder(_fromSkill);
    for (const category of this.reorderSkills) {
      for (const skill of category.data) {
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
    const data = [{ top_skills: listTop }]
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
      this.closeDialog(false);
    }
  }
  closeDialog(event: boolean) {
    this.nbDialogRef.close(event);
  }
}
