import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitButtonGroupComponent } from './ait-button-group.component';
import { AitButtonModule } from '../ait-button/ait-button.module';

@NgModule({
  declarations: [AitButtonGroupComponent],
  imports: [CommonModule, AitButtonModule],
  exports: [AitButtonGroupComponent],
  providers: [],
})
export class AitButtonGroupModule { }
