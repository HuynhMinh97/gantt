import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbIconModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AitBackButtonComponent } from './ait-back-button.component';

@NgModule({
  declarations: [AitBackButtonComponent],
  imports: [CommonModule, NbIconModule, NbEvaIconsModule],
  exports: [AitBackButtonComponent],
  providers: [],
})
export class AitBackButtonModule { }
