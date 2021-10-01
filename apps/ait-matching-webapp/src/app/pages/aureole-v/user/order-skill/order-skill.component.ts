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

 

}
