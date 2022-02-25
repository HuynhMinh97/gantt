import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbDialogModule } from '@nebular/theme';
import { AitButtonModule } from '../ait-button/ait-button.module';
import { AitDialogMesssgeComponent } from './ait-dialog-messsge.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AitTextGradientModule } from '../ait-text-gradient/ait-text-gradient.module';

@NgModule({
  declarations: [AitDialogMesssgeComponent],
  imports: [
    CommonModule, 
    AitButtonModule,
    NbDialogModule,
    AitTextGradientModule,
    Ng2SmartTableModule,],
  exports: [AitDialogMesssgeComponent],
})
export class  AitMessageErrorModule { }
