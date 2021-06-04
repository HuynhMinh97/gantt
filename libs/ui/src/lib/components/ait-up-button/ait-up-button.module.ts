import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbIconModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AitUpButtonComponent } from './ait-up-button.component';

@NgModule({
  declarations: [AitUpButtonComponent],
  imports: [ CommonModule,NbIconModule,NbEvaIconsModule ],
  exports: [AitUpButtonComponent],
  providers: [],
})
export class AitUpButtonModule {}
