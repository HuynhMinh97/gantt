import { UserService } from './../../../../services/user.service';
import { AitAppUtils, AitAuthService, AitBaseComponent, AitConfirmDialogComponent, AppState } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { ButtonActionDto, OrderSkill, UserSkill } from './interface';
import { KEYS } from '@ait/shared';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UserOnboardingService } from 'apps/ait-matching-webapp/src/app/services/user-onboarding.service';

@Component({
  selector: 'ait-order-skill',
  templateUrl: './order-skill.component.html',
  styleUrls: ['./order-skill.component.scss']
})
export class OrderSkillComponent extends AitBaseComponent implements OnInit {
  skillByCategory: OrderSkill[] = [
    
  ];
  cloneData: OrderSkill[] = [];
  isLoading: boolean = false;
  buttons: ButtonActionDto[] = [
    {
      title: "system.key.save",
      style: "disabled",
      action: () => {},
    },
    {
      title: "system.key.close",
      style: "normal",
      action: () => {
        this.closeDialog(false);
      },
    },
  ];

  constructor(
    protected ref: NbDialogRef<OrderSkillComponent>,
    private dialogService: NbDialogService,
    public store: Store<AppState>,
    private router: Router,
    authService: AitAuthService,
    userService: UserService,
    toastrService: NbToastrService,
    private onboardingService: UserOnboardingService,
    // private onboardingService: OnBoardingService
  ) {
    super(store, authService, null, null, null);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.ref.close(false);
      }
    });
  }
  ngOnInit(): void {
    // this.cloneData = AitAppUtils.deepCloneObject(this.skillByCategory);
  }

  setupButtons(status: boolean): void {
    if (status) {
      this.buttons[0] = {
        title: "system.key.save",
        style: "disabled",
        action: () => {},
      };
    } else {
      this.buttons[0] = {
        title: "system.key.save",
        style: "active",
        action: () => {
          this.onSaveConfirm();
        },
      };
    }
  }

  passToChange(skill: UserSkill, currentIndex?: number) {
    if (skill.top_skill) {
      const index = this.skillByCategory.findIndex(
        (e) => e.name === skill.category?.value
      );
      if (index !== -1) {
        const indexVal = this.skillByCategory[index].data.findIndex(
          (e) => e._key === skill._key
        );
        if (indexVal !== -1) {
          this.skillByCategory[index].data[indexVal].top_skill = false;
        }
      }
      this.skillByCategory[0].data = this.skillByCategory[0].data.filter(
        (e) => e._key !== skill._key
      );
      this.isChanged();
    } else if (this.skillByCategory[0].data.length < 5) {
      const categoryBySkill = skill.category?.value;
      const index = this.skillByCategory.findIndex(
        (e) => e.name === categoryBySkill
      );
      if (index) {
        skill.top_skill = true;
        if (currentIndex) {
          this.skillByCategory[0].data.splice(currentIndex, 0);
        } else {
          this.skillByCategory[0].data.push();
        }
      }
      this.isChanged();
    } else {
      this.showToastr("", `You can only have top 5 skills !!`, KEYS.INFO);
    }
  }

  dropEvent(event: CdkDragDrop<string[]>, category: OrderSkill) {
    const dropData = event.item.data as UserSkill;
    if (dropData.top_skill) {
      if (category.name === KEYS.TOP5) {
        if (event.currentIndex !== event.previousIndex) {
          moveItemInArray(
            this.skillByCategory[0].data,
            event.previousIndex,
            event.currentIndex
          );
          this.isChanged();
        }
      } else {
        this.passToChange(dropData);
      }
    } else {
      if (category.name === KEYS.TOP5) {
        this.passToChange(dropData, event.currentIndex);
      } else if (
        dropData.category?.value === category.name &&
        event.currentIndex !== event.previousIndex
      ) {
        const index = this.skillByCategory.findIndex(
          (e) => e.name === category.name
        );
        if (index) {
          const previousIndex = this.skillByCategory[index].data.findIndex(
            (skill) => skill._key === dropData._key
          );
          const dropContainer = this.skillByCategory[index].data.filter(
            (skill) => skill.top_skill === false
          );
          const itemDropped = dropContainer[event.currentIndex];
          const currentIndex = this.skillByCategory[index].data.findIndex(
            (skill) => skill._key === itemDropped._key
          );

          moveItemInArray(
            this.skillByCategory[index].data,
            previousIndex,
            currentIndex
          );
          this.isChanged();
        }
      }
    }
  }

  removeSkill(category: OrderSkill, skill: UserSkill) {
    if (category.name === KEYS.TOP5) {
      this.passToChange(skill);
    } else {
      const index = this.skillByCategory.findIndex(
        (e) => e.name === skill.category.value
      );
      this.skillByCategory[index].data = this.skillByCategory[
        index
      ].data.filter((data) => data._key !== skill._key);
      this.isChanged();
    }
  }

  async onSaveConfirm() {
    const topSkill = [];
    const allSkill = [];
    if (this.isEqual(this.cloneData, this.skillByCategory)) {
      this.showToastr('', this.getMsg('I0007'));
      this.closeDialog(false);
    } else {
      this.skillByCategory.forEach((category) => {
        category.data.forEach((skill, index) => {
          if (category.name === KEYS.TOP5) {
            const tempSkill = AitAppUtils.deepCloneObject(skill);
            delete tempSkill.top_skill;
            delete tempSkill.sort_no;
            topSkill.push(tempSkill);
          } else {
            const cloneSkill = AitAppUtils.deepCloneObject(skill) as UserSkill;
            delete cloneSkill.top_skill;
            cloneSkill.sort_no = index + 1;
            allSkill.push(cloneSkill);
          }
        });
      });

      const rq = { user_id: this.user_id };
      let error = 0;

      // await this.onboardingService
      //   .saveUserTopSkill(rq, topSkill)
      //   .then((res) => {
      //     if (res.status && res.status !== KEYS.OK) {
      //       error++;
      //     }
      //   })
      //   .catch(() => {
      //     error++;
      //   });
      // await this.onboardingService
      //   .saveReorderSkill(rq, allSkill)
      //   .then((res) => {
      //     if (res.status && res.status !== KEYS.OK) {
      //       error++;
      //     }
      //   })
      //   .catch(() => {
      //     error++;
      //   });

      if (error > 0) {
        this.showToastr('', this.getMsg('I0007'));
      } else {
        this.showToastr('', this.getMsg('I0007'));
        this.ref.close(this.skillByCategory);
      }
    }
  }

  closeDialog(event: boolean | any) {
    const changed = !this.isChanged();
    if (changed) {
      this.dialogService
        .open(AitConfirmDialogComponent, {
          closeOnBackdropClick: false,
          hasBackdrop: true,
          autoFocus: false,
          context: {
            title: this.getMsg("system.confirm-close"),
          },
        })
        .onClose.subscribe((e) => {
          if (e) {
            this.ref.close(false);
          }
        });
    } else {
      this.ref.close(event);
    }
  }

  isEqual(arr1: any, arr2: any) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }

  isChanged() {
    const clone = this.getNonTopSkillData(this.cloneData);
    const current = this.getNonTopSkillData(this.skillByCategory);
    const status = this.isEqual(clone, current);
    this.setupButtons(status);
    return status;
  }

  getNonTopSkillData(arr: OrderSkill[]) {
    const deepArr = AitAppUtils.deepCloneObject(arr);
    deepArr.forEach((category: OrderSkill, index: number) => {
      if (index !== 0) {
        category.data = category.data.filter((obj) => obj.top_skill === false);
      }
    });
    return deepArr;
  }

}
