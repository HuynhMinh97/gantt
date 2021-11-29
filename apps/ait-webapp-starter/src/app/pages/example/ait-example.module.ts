import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AitButtonModule,
  AitInputTextModule,
  AitSpaceModule,
  AitCommonLayoutModule,
  AitLabelModule,
  AitChipModule,
  AitDragScrollModule,
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
  AitUserSettingService,
  AitGroupInputModule,
} from '@ait/ui';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AitExampleGraphQLModule } from './graphql/ait-example-graphql.module';
import { AitExampleUiModule } from './ui/ait-example-ui.module';
import { AitExampleRoutingModule } from './ait-example-routing.module';
import { NbInputModule } from '@nebular/theme';
import { RenderInputComponent } from './render-input/render-input.component';

// Những module cần dùng cho 1 pages
const AIT_UI_MODULES = [
  AitButtonModule,
  AitInputTextModule,
  AitSpaceModule,
  AitCommonLayoutModule,
  AitLabelModule,
  AitChipModule,
  AitDragScrollModule,
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
  AitGroupInputModule
];

const AIT_UI_SERVICES = [
  AitTranslationService,
  AitAuthScreenService,
  AitAuthGuardService,
  AitUserService,
  AitUserSettingService,
];

@NgModule({
  declarations: [
  
    RenderInputComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AitExampleGraphQLModule,
    AitExampleUiModule,
    AitExampleRoutingModule,
    NbInputModule,
    ...AIT_UI_MODULES,
  ],
  exports: [AitExampleRoutingModule],
  providers: [...AIT_UI_SERVICES],
})
export class AitExamplePageModule { }
