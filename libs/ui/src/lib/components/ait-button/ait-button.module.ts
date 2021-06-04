import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbIconModule, NbTooltipModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AitTranslationService } from '../../services';
import { AitButtonComponent } from './ait-button.component';

@NgModule({
  declarations: [AitButtonComponent],
  imports: [CommonModule, NbIconModule, NbEvaIconsModule, NbButtonModule, NbTooltipModule],
  exports: [AitButtonComponent],
  providers: [AitTranslationService],
})
export class AitButtonModule { }
