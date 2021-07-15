import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitButtonGroupComponent } from './ait-button-group.component';
import { AitButtonModule } from '../ait-button/ait-button.module';
import { NbSpinnerModule } from '@nebular/theme';

@NgModule({
  declarations: [AitButtonGroupComponent],
  imports: [CommonModule, AitButtonModule, NbSpinnerModule],
  exports: [AitButtonGroupComponent],
  providers: [],
})
export class AitButtonGroupModule { }

export * from './ait-button-group.component';
