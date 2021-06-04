import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AitLoginComponent } from './pages/auth/ait-login/ait-login.component';
import { AitSignUpComponent } from './pages/auth/ait-signup/ait-signup.component';
import { AitResetPasswordComponent } from './pages/auth/ait-reset-password/ait-reset-password.component';
import { AitChangePwdComponent } from './pages/auth/ait-change-password/ait-change-password.component';
import {
  AitAutocompleteMasterDataModule,
  AitBackButtonModule,
  AitButtonModule,
  AitCommonLayoutModule,
  AitErrorMessageModule,
  AitSpaceModule,
  AitThemeModule,
  AitTranslationService,
  AitUiModule,
  AitUpButtonModule
} from '@ait/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbCheckboxModule, NbIconModule, NbInputModule, NbSpinnerModule } from '@nebular/theme';
import { AitUserSettingComponent } from './pages/user-setting/ait-user-setting.component';
import { AitAuthRoutingModule } from './auth-routing.module';
import { Ait403Component } from './pages/auth/ait-403/ait-403.component';
import { Ait404Component } from './pages/auth/ait-404/ait-404.component';


const AIT_MODULES = [
  AitCommonLayoutModule,
  AitUpButtonModule,
  AitBackButtonModule,
  AitErrorMessageModule,
  AitSpaceModule,
  AitButtonModule,
  AitAutocompleteMasterDataModule
]

@NgModule({
  declarations: [
    AitChangePwdComponent,
    AitLoginComponent,
    AitSignUpComponent,
    AitResetPasswordComponent,
    AitUserSettingComponent,
    Ait403Component,
    Ait404Component,
  ],
  imports: [
    AitThemeModule.forRoot(),
    AitUiModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbIconModule,
    NbEvaIconsModule,
    NbInputModule,
    NbSpinnerModule,
    NbCheckboxModule,
    AitAuthRoutingModule,
    ...AIT_MODULES
  ],
  providers: [
    AitTranslationService
  ],
  exports: [
    AitChangePwdComponent,
    AitLoginComponent,
    AitSignUpComponent,
    AitResetPasswordComponent,
    AitUserSettingComponent,
    AitAuthRoutingModule
  ]
})
export class AitAuthModule { }
