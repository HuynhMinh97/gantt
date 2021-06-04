import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbIconModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AitOutputFileComponent } from './ait-output-file.component';
import { AitBinaryDataService } from '../../services/ait-binary-data.service';
import { AitTranslationService } from '../../services/common/ait-translate.service';

@NgModule({
  declarations: [AitOutputFileComponent],
  imports: [CommonModule, NbIconModule, NbEvaIconsModule],
  exports: [AitOutputFileComponent],
  providers: [AitBinaryDataService, AitTranslationService],
})
export class AitOutputFileModule { }
