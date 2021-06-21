import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitFileUploaderService } from '../../services/common/ait-file-upload.service';
import { AitMasterDataService } from '../../services/common/ait-master-data.service';
import { AitTranslationService } from '../../services/common/ait-translate.service';
import { AitBinaryDataService } from '../../services/ait-binary-data.service';
import { AitDayJSService } from '../../services/ait-dayjs.service';
import { rootReducers } from '../../state/rootReducers';
import { StoreModule } from '@ngrx/store';
import { AitInputFileComponent } from './ait-input-file.component';
import { NbIconModule, NbTooltipModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AitProgressModule } from '../ait-progress/ait-progress.module';
import { AitLabelModule } from '../ait-label/ait-label.module';

@NgModule({
  declarations: [AitInputFileComponent],
  imports: [
    CommonModule,
    NbIconModule,
    NbEvaIconsModule,
    AitProgressModule,
    NbTooltipModule,
    AitLabelModule,
    StoreModule.forRoot(
      { ...rootReducers },
      {
        initialState: {},
      },
    ),],
  exports: [AitInputFileComponent],
  providers: [
    AitFileUploaderService,
    AitMasterDataService,
    AitTranslationService,
    AitBinaryDataService,
    AitDayJSService,
  ],
})
export class AitInputFileModule { }
