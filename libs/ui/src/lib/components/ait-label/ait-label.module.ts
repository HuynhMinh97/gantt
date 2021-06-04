import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitLabelComponent } from './ait-label.component';
import { AitTranslationService } from '../../services';
import { AitTranslatePipe } from '../../@theme/pipes/ait-translate.pipe';

@NgModule({
  declarations: [AitLabelComponent],
  imports: [ CommonModule ],
  exports: [AitLabelComponent],
  providers: [AitTranslationService, AitTranslatePipe],
})
export class AitLabelModule {}
