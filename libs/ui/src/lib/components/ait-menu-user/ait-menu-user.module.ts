import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitMenuUserComponent } from './ait-menu-user.component';
import {
  NbActionsModule,
  NbContextMenuModule,
  NbIconModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { FormsModule } from '@angular/forms';
import { AitButtonModule } from '../ait-button/ait-button.module';
import { AitSpaceModule } from '../ait-space/ait-space.module';

@NgModule({
  declarations: [AitMenuUserComponent],
  imports: [
    CommonModule,
    NbActionsModule,
    NbIconModule,
    NbEvaIconsModule,
    NbContextMenuModule,
    FormsModule,
    AitButtonModule,
    AitSpaceModule
  ],
  exports: [AitMenuUserComponent],
  providers: [],
})
export class AitMenuUserModule {}
