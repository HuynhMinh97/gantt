import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbThemeModule,
  NbTooltipModule,
  NbAutocompleteModule,
  NbInputModule,
  NbFormFieldModule,
  NbOptionModule,
  NbRadioModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbCardModule,
  NbSpinnerModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbSecurityModule } from '@nebular/security';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DEFAULT_THEME } from './styles/theme.default';
import { MATERIAL_LIGHT_THEME } from './styles/material/theme.material-light';

export const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbEvaIconsModule,
  NbTooltipModule,
  NbAutocompleteModule,
  NbInputModule,
  NbFormFieldModule,
  FormsModule,
  ReactiveFormsModule,
  NbAutocompleteModule,
  NbOptionModule,
  NbRadioModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbCardModule,
  NbSpinnerModule,
];
export const COMPONENTS = [
  // AitUploadDirective,
  // AitHighlightDirective,
  // AitCounterDirective,
  // AitDndDirective,
  // AitClickOutsideDirective
];
const PIPES = [
  // AitPluralPipe,
  // AitDatePipe,
  // AitRoundPipe,
  // AitTimingPipe,
  // AitTimezonePipe,
  // AitTranslatePipe,
  // AitTranslatePipe,
  // AitCapitalizePipe,
  // AitCapitalizePipe
];

@NgModule({
  imports: [CommonModule, ...NB_MODULES],
  exports: [CommonModule, ...PIPES, ...COMPONENTS],
  declarations: [...COMPONENTS, ...PIPES],
})
export class AitThemeModule {
  static forRoot(): ModuleWithProviders<AitThemeModule> {
    return {
      ngModule: AitThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'default',
          },
          [ DEFAULT_THEME,MATERIAL_LIGHT_THEME ],
        ).providers,
      ],
    };
  }
}
