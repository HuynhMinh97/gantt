/* eslint-disable @typescript-eslint/no-empty-function */
import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitButtonModule } from './components/ait-button/ait-button.module';
import { AitThemeModule } from './@theme/theme.module';
import { AitInputTextModule } from './components/ait-input-text/ait-input-text.module';
import { AitSpaceModule } from './components/ait-space/ait-space.module';
import { AitLabelModule } from './components/ait-label/ait-label.module';
import { AitChipModule } from './components/ait-chip/ait-chip.module';
import { AitDragScrollModule } from './components/ait-drag-scroll/ait-drag-scroll.module';
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
  NbCardModule
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
    AitDragScrollModule,
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
    StoreModule.forRoot({
      ...rootReducers,
      ...inItialState
    }),
    ...NB_MODULES,
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
    AitDragScrollModule,
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
    AitBaseComponent
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
    }
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
    @Optional() @SkipSelf() parentModule?: AitUiModule,

  ) {
    // console.log = () => { };
    console.error = () => { }
    const environment: any = envService;
    const uri = environment?.API_PATH?.BASE_GRAPHQL_PREFIX;
    if (!uri) {
      throw new Error(
        'GraphQLService must be provided with uri');
    }
    else {

      // create error link
      const errorLink = onError(({ graphQLErrors, networkError }) => {
        // if (graphQLErrors)
        //   graphQLErrors.map(({ message, locations, path }) =>
        //     console.log(
        //       `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        //     ),
        //   );
        // if (networkError) console.log(networkError);
      });

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
