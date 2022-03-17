import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbIconModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AitOutputFileComponent } from './ait-output-file.component';
import { AitBinaryDataService } from '../../services/ait-binary-data.service';
import { AitTranslationService } from '../../services/common/ait-translate.service';
import { AitLabelModule } from '../ait-label/ait-label.module';

@NgModule({
  declarations: [AitOutputFileComponent],
  imports: [CommonModule, NbIconModule, NbEvaIconsModule,AitLabelModule],
  exports: [AitOutputFileComponent],
  providers: [AitBinaryDataService, AitTranslationService],
})
export class AitOutputFileModule { }
