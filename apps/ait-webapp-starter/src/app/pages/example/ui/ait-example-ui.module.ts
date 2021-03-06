import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AitButtonModule,
  AitInputTextModule,
  AitSpaceModule,
  AitCommonLayoutModule,
  AitLabelModule,
  AitChipModule,
  AitBackButtonModule,
  AitUpButtonModule,
  AitOutputFileModule,
  AitErrorMessageModule,
  AitTabsModule,
  AitDividerModule,
  AitTextareaModule,
  AitInputNumberModule,
  AitInputFileModule,
  AitTimePickerModule,
  AitTextGradientModule,
  AitCardContentModule,
  AitMenuUserModule,
  AitButtonGroupModule,
  AitAutocompleteMasterDataModule,
  AitAutocompleteMasterModule,
  AitDatepickerModule,
  AitAuthGuardService,
  AitAuthScreenService,
  AitTranslationService,
  AitUserService,
  AitOutputTextModule,
  AitConfirmDialogModule,
  AitTableButtonModule
} from '@ait/ui';
import { AitUiComponent } from './ait-example-ui.component';
import { NbButtonModule, NbInputModule } from '@nebular/theme';
import { DragDropModule } from '@angular/cdk/drag-drop';


// There are some module from @ait/ui you need
const AIT_UI_MODULES = [
  AitButtonModule,
  AitInputTextModule,
  AitSpaceModule,
  AitCommonLayoutModule,
  AitLabelModule,
  AitChipModule,
  AitBackButtonModule,
  AitUpButtonModule,
  AitDatepickerModule,
  AitOutputFileModule,
  AitErrorMessageModule,
  AitTabsModule,
  AitDividerModule,
  AitTextareaModule,
  AitInputNumberModule,
  AitInputFileModule,
  AitTimePickerModule,
  AitTextGradientModule,
  AitCardContentModule,
  AitMenuUserModule,
  AitButtonGroupModule,
  AitAutocompleteMasterDataModule,
  AitAutocompleteMasterModule,
  AitOutputTextModule,
  AitConfirmDialogModule,
  NbButtonModule,
  NbInputModule,
  AitTimePickerModule,
  AitTableButtonModule
];

// There are some service from @ait/ui you need
const AIT_UI_SERVICES = [
  AitTranslationService,
  AitAuthScreenService,
  AitAuthGuardService,
  AitUserService,
];

@NgModule({
  declarations: [AitUiComponent],
  imports: [
    CommonModule,
    DragDropModule,
    ...AIT_UI_MODULES,
  ],
  exports: [AitUiComponent],
  providers: [...AIT_UI_SERVICES],
})
export class AitExampleUiModule { }
