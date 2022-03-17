import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitTranslationService } from '../../services';
import { NbDialogModule } from '@nebular/theme';
import { AitButtonModule } from '../ait-button/ait-button.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, AitButtonModule,NbDialogModule],
  exports: [],
  providers: [AitTranslationService],
})
export class AitConfirmDialogModule { }
