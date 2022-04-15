/* eslint-disable @typescript-eslint/no-empty-function */
import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { AitTemplatePageModule } from './components/ait-template-page/ait-template-page.module';
import { CommonModule, registerLocaleData } from '@angular/common';
import { AitButtonModule } from './components/ait-button/ait-button.module';
import { AitThemeModule } from './@theme/theme.module';
import { AitInputTextModule } from './components/ait-input-text/ait-input-text.module';
import { AitSpaceModule } from './components/ait-space/ait-space.module';
import { AitLabelModule } from './components/ait-label/ait-label.module';
import { AitChipModule } from './components/ait-chip/ait-chip.module';
import { AitBackButtonModule } from './components/ait-back-button/ait-back-button.module';
import { AitUpButtonModule } from './components/ait-up-button/ait-up-button.module';
import { AitDatepickerModule } from './components/ait-datepicker/ait-datepicker.module';
import { AitOutputFileModule } from './components/ait-output-file/ait-output-file.module';
import { AitErrorMessageModule } from './components/ait-error-message/ait-error-message.module';
import { AitTabsModule } from './components/ait-tabs/ait-tabs.module';
import { AitDividerModule } from './components/ait-divider/ait-divider.module';
import { AitTextareaModule } from './components/ait-text-area/ait-text-area.module';
import { AitInputNumberModule } from './components/ait-input-number/ait-input-number.module';
import { AitInputFileModule } from './components/ait-input-file/ait-input-file.module';
import { AitBaseService, AitTranslationService } from './services';
import { AitProgressModule } from './components/ait-progress/ait-progress.module';
import { AitTextInputComponent } from './components/ait-input-text/ait-input-text.component';
import { AitTimePickerModule } from './components/ait-timepicker/ait-timepicker.module';
import { AitTextGradientModule } from './components/ait-text-gradient/ait-text-gradient.module';
import { AitCardContentModule } from './components/ait-card-content/ait-card-content.module';
import { AitConfirmDialogModule } from './components/ait-confirm-dialog/ait-confirm-dialog.module';
import { AitConfirmDialogComponent } from './components/ait-confirm-dialog/ait-confirm-dialog.component';
import { AitTranslatePipe } from './@theme/pipes/ait-translate.pipe';
import { AitMenuUserModule } from './components/ait-menu-user/ait-menu-user.module';
import { AitAutocompleteMasterModule } from './components/ait-autocomplete-master/ait-autocomplete-master.module';
import { AitAutocompleteMasterDataModule } from './components/ait-autocomplete-master-data/ait-autocomplete-master-data.module';
import { Store, StoreModule } from '@ngrx/store';
import { rootReducers } from './state/rootReducers';
import { AitBaseComponent } from './components/base.component';
import {
  NbSidebarModule,
  NbLayoutModule,
  NbSpinnerModule,
  NbCheckboxModule,
  NbMenuModule,
  NbDatepickerModule,
  NbDialogModule,
  NbWindowModule,
  NbToastrModule,
  NbCardModule,
  NbIconLibraries
} from '@nebular/theme';
import { AitEnvironmentService } from './services/ait-environment.service';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/cache';
import { onError } from '@apollo/client/link/error';
import { HttpHeaders } from '@angular/common/http';
import { DragScrollModule } from 'ngx-drag-scroll';
import { AitOutputTextModule } from './components/ait-output-text/ait-output-text.module';
import { AitCommonLayoutModule } from './@theme/layouts/ait-common-layout/ait-common-layout.module';
import { AitUiComponent } from './ait-ui.component';
import { AppState, } from './state/selectors';
import { AitSettingAppService } from './services/ait-setting-app.service';
import { AitTemplatePopupModule } from './components/ait-template-popup/ait-template-popup.module';
import { AitTocMenuModule } from './components/ait-toc-menu/ait-toc-menu.module';
import localeEnn from '@angular/common/locales/en';
import localeVnn from '@angular/common/locales/vi';
import localeJpp from '@angular/common/locales/ja';
import { LocaleProvider } from './@theme/locale/locale.provider';
import { AitTableCellModule } from './components/ait-table-cell/ait-table-cell.module';
import { AitGroupSearchModule } from './components/ait-group-search/ait-group-search.module';
import { AitGroupInputModule } from './components/ait-group-input/ait-group-input.module';
import { AitTableButtonModule } from './components/ait-table-button/ait-table-button.module';
import { AitGroupViewModule } from './components/ait-group-view/ait-group-view.module';
import { AitButtonTableModule } from './components/ait-button-setting-table/ait-button-setting-table.module';
registerLocaleData(localeEnn);
registerLocaleData(localeVnn);
registerLocaleData(localeJpp);

export function initializeApp(appInitService: AitSettingAppService) {
  return () => {
    return appInitService.Init();
  }
}

const inItialState = {};

const NB_MODULES = [
  NbSidebarModule.forRoot(),
  NbLayoutModule,
  NbSpinnerModule,
  NbCheckboxModule,
  NbMenuModule.forRoot(),
  NbDatepickerModule.forRoot(),
  NbDialogModule.forRoot(),
  NbWindowModule.forRoot(),
  NbToastrModule.forRoot(),
  NbCardModule,
]


@NgModule({
  declarations: [AitConfirmDialogComponent, AitTranslatePipe, AitBaseComponent, AitUiComponent],
  imports: [
    CommonModule,
    DragScrollModule,
    AitThemeModule.forRoot(),
    AitButtonModule,
    AitInputTextModule,
    AitInputNumberModule,
    AitInputFileModule,
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
    AitTemplatePopupModule,
    AitDividerModule,
    AitTextareaModule,
    AitProgressModule,
    AitTimePickerModule,
    AitCardContentModule,
    AitButtonModule,
    AitConfirmDialogModule,
    AitMenuUserModule,
    AitAutocompleteMasterModule,
    AitAutocompleteMasterDataModule,
    AitOutputTextModule,
    AitTextGradientModule,
    AitGroupSearchModule,
    AitGroupInputModule,
    AitGroupViewModule,
    AitButtonTableModule,
    StoreModule.forRoot({
      ...rootReducers,
      ...inItialState
    }),
    ...NB_MODULES,
    AitTocMenuModule,
    AitTableCellModule,
    AitTableButtonModule,
    AitTemplatePageModule
  ],
  exports: [
    CommonModule,
    AitThemeModule,
    AitButtonModule,
    AitTextInputComponent,
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
    AitTemplatePopupModule,
    AitDividerModule,
    AitTextareaModule,
    AitInputNumberModule,
    AitInputFileModule,
    AitProgressModule,
    AitTimePickerModule,
    AitTextGradientModule,
    AitGroupSearchModule,
    AitGroupInputModule,
    AitGroupViewModule,
    AitCardContentModule,
    AitButtonModule,
    AitConfirmDialogModule,
    AitMenuUserModule,
    AitAutocompleteMasterModule,
    AitAutocompleteMasterDataModule,
    DragScrollModule,
    AitOutputTextModule,
    AitTranslatePipe,
    AitUiComponent,
    AitBaseComponent,
    AitTocMenuModule,
    AitTableCellModule,
    AitTableButtonModule,
    AitButtonTableModule,
    AitTemplatePageModule
  ],
  providers: [
    AitBaseService,
    AitTranslationService,
    AitEnvironmentService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AitSettingAppService],
      multi: true
    },
    LocaleProvider
  ]
})
export class AitUiModule {
  private static httpLink: HttpLink;
  private static apollo: Apollo;
  constructor(
    envService: AitEnvironmentService,
    private httpLink: HttpLink,
    private apollo: Apollo,
    private store: Store<AppState>,
    private iconLibraries: NbIconLibraries,
    @Optional() @SkipSelf() parentModule?: AitUiModule,


  ) {
    // console.log = () => { };
    // console.error = () => { }
    const environment: any = envService;
    const uri = environment?.API_PATH?.BASE_GRAPHQL_PREFIX;
    if (!uri) {
      throw new Error(
        'GraphQLService must be provided with uri');
    }
    else {

      // create error link
      const errorLink = onError(({ graphQLErrors, networkError }) => {});

      const http = this.httpLink.create({
        uri, headers: new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        })
      });
      const link = errorLink.concat(http);

      this.apollo.create({
        link,
        cache: new InMemoryCache({
          addTypename: false
        }),
        defaultOptions: {
          watchQuery: {
            errorPolicy: 'all'
          }
        }
      });
    }
    if (parentModule) {
      throw new Error(
        'AitUiModule is already loaded. Import it in the AppModule only');
    }
  }
  static forRoot(config): ModuleWithProviders<AitUiModule> {
    return {
      ngModule: AitUiModule,
      providers: [
        {
          provide: AitEnvironmentService, useValue: config
        }
      ]
    };
  }
}
