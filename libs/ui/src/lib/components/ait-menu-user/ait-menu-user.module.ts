import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitMenuUserComponent } from './ait-menu-user.component';
import { NbActionsModule, NbIconModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AitTranslatePipe } from '../../@theme/pipes/ait-translate.pipe';

@NgModule({
  declarations: [AitMenuUserComponent],
  imports: [ CommonModule,NbActionsModule,NbIconModule,NbEvaIconsModule ],
  exports: [AitMenuUserComponent],
  providers: [],
})
export class AitMenuUserModule {}
