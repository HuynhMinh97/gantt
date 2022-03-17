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
import { NbIconModule, NbPopoverModule, NbSpinnerModule, NbTooltipModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AitProgressModule } from '../ait-progress/ait-progress.module';
import { AitLabelModule } from '../ait-label/ait-label.module';
import { AitErrorMessageModule } from '../ait-error-message/ait-error-message.module';
import { DragScrollModule } from 'ngx-drag-scroll';
import { DndDirective } from '../../@theme/directives/dnd-file.directive';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AitInputFileComponent,DndDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbIconModule,
    NbEvaIconsModule,
    AitProgressModule,
    NbTooltipModule,
    AitLabelModule,
    AitErrorMessageModule,
    DragScrollModule,
    NbTooltipModule,
    NbPopoverModule,
    NbSpinnerModule,
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
