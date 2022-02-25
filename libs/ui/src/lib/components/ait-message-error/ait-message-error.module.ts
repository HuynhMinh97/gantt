import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitTranslationService } from '../../services';
import { NbDialogModule } from '@nebular/theme';
import { AitButtonModule } from '../ait-button/ait-button.module';
import { AitMessageErrorComponent } from './ait-message-error.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AitTextGradientModule } from '../ait-text-gradient/ait-text-gradient.module';

@NgModule({
  declarations: [AitMessageErrorComponent],
  imports: [
    CommonModule, 
    AitButtonModule,
    NbDialogModule,
    AitTextGradientModule,
    Ng2SmartTableModule,],
  exports: [AitMessageErrorComponent],
})
export class  AitMessageErrorModule { }
