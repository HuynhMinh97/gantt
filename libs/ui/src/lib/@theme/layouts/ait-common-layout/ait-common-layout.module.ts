import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitCommonLayoutComponent } from './ait-common-layout.component';
import { NbIconModule, NbLayoutModule, NbSidebarModule } from '@nebular/theme';
import { AitFooterComponent } from '../../../components/ait-footer/ait-footer.component';
import { AitMenuUserModule } from '../../../components/ait-menu-user/ait-menu-user.module';
import { AitMenuActionsModule } from '../../../components/ait-menu-actions/ait-menu-actions.module';
import { AitBackButtonModule } from '../../../components/ait-back-button/ait-back-button.module';
import { AitUpButtonModule } from '../../../components/ait-up-button/ait-up-button.module';
import { AitTextareaModule } from '../../../components/ait-text-area/ait-text-area.module';

@NgModule({
  declarations: [AitCommonLayoutComponent, AitFooterComponent,],
  imports: [
    CommonModule,
    NbLayoutModule,
    AitMenuUserModule,
    AitMenuActionsModule, AitBackButtonModule, AitUpButtonModule, NbSidebarModule, NbIconModule,
    AitTextareaModule
  ]
    ,
  exports: [AitCommonLayoutComponent],
  providers: [],
})
export class AitCommonLayoutModule { }
