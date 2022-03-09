import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import {
  AitAuthGuardService,
  AitAuthScreenService,
  AitChipModule,
  AitGroupInputModule,
  AitTabsModule,
  AitUiModule,
  rootReducers,
} from '@ait/ui';
import { AitAuthModule } from '@ait/auth';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { aureoleRootReducers } from './state/rootReducers';
import { AureoleRoutingModule } from './app-routing.module';
import {
  NbButtonModule,
  NbIconModule,
  NbSpinnerModule,
  NbTooltipModule,
  NbCheckboxModule,
  NbCardModule,
  NbInputModule,
  NbFormFieldModule,
  NbRadioModule,
} from '@nebular/theme';
import { AureoleVCardComponent } from './pages/aureole-v/recommenced-user/components/card/card.component';
import { ContentRowComponent } from './pages/aureole-v/recommenced-user/components/content/content.component';
import { CardSkeletonComponent } from './pages/aureole-v/recommenced-user/components/card-skeleton/card-skeleton.component';
import { RecommencedComponent } from './pages/aureole-v/recommenced-user/recommenced-user.component';
import { SyncApiConfigService } from './services/sync_api_config.service';
import { SyncPEService } from './services/sync_pe_history.service';
import { ReactionService } from './services/reaction.service';
import { RecommencedUserService } from './services/recommenced-user.service';
import { UserExperienceComponent } from './pages/aureole-v/user/user-experience/user-experience.component';
import { UserEducationComponent } from './pages/aureole-v/user/user-education/user-education.component';
import { UserLanguageComponent } from './pages/aureole-v/user/user-language/user-language.component';
import { UserOnboardingComponent } from './pages/aureole-v/user/user-onboarding/user-onboarding.component';
import { UserCourseComponent } from './pages/aureole-v/user/user-course/user-course.component';
import { UserCertificateComponent } from './pages/aureole-v/user/user-certificate/user-certificate.component';
import { UserSkillsComponent } from './pages/aureole-v/user/user-skills/user-skills.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UserProfileComponent } from './pages/aureole-v/user/user-profile/user-profile.component';
import { CommonModule } from '@angular/common';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { UserJobAlertComponent } from './pages/aureole-v/user/user-job-alert/user-job-alert.component';
import { UserReorderSkillsComponent } from './pages/aureole-v/user/user-reorder-skills/user-reorder-skills.component';
import { CardContentProfileComponent } from './pages/aureole-v/user/user-profile/card-content/card-content.component';
import { CountryComponent } from './components/country/country.component';
import { UserLanguageDetailComponent } from './pages/aureole-v/user/user-language-detail/user-language-detail.component';
import { UserEducationDetailComponent } from './pages/aureole-v/user/user-education-detail/user-education-detail.component';
import { UserCourseDetailComponent } from './pages/aureole-v/user/user-course-detail/user-course-detail.component';
import { UserCertificateDetailComponent } from './pages/aureole-v/user/user-certificate-detail/user-certificate-detail.component';
import { UserExperienceDetailComponent } from './pages/aureole-v/user/user-experience-detail/user-experience-detail.component';
import { UserProjectDetailComponent } from './pages/aureole-v/user/user-project-detail/user-project-detail.component';
import { UserOnboardingDetailComponent } from './pages/aureole-v/user/user-onboarding-detail/user-onboarding-detail.component';
import { UserJobAlertDetailComponent } from './pages/aureole-v/user/user-job-alert-detail/user-job-alert-detail.component';
import { UserProjectComponent } from './pages/aureole-v/user/user-project/user-project.component';
import { UserProjectAutoComponent } from './pages/aureole-v/user/user-project-auto/user-project-auto.component';

const AIT_UI_MODULES = [AitChipModule, AitTabsModule];

const AIT_UI_SERVICES = [AitAuthGuardService, AitAuthScreenService];

const NB_UI_MODULES = [
  NbIconModule,
  NbSpinnerModule,
  NbTooltipModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
  NbFormFieldModule,
  NbRadioModule,
];

const AUREOLE_V_COMPONENTS = [
  AureoleVCardComponent,
  ContentRowComponent,
  CardSkeletonComponent,
];

const PAGES = [
  RecommencedComponent,
  UserExperienceComponent,
  UserEducationComponent,
  UserLanguageComponent,
  UserOnboardingComponent,
  UserProjectComponent,
  UserCourseComponent,
  UserCertificateComponent,
  UserSkillsComponent,
  UserReorderSkillsComponent,
  UserProfileComponent,
  UserJobAlertComponent,
  CardContentProfileComponent,
  UserLanguageDetailComponent,
  UserEducationDetailComponent,
  UserCourseDetailComponent,
  UserCertificateDetailComponent,
  UserExperienceDetailComponent,
  UserProjectDetailComponent,
  UserOnboardingDetailComponent,
  CountryComponent,
  UserJobAlertDetailComponent,
  UserProjectAutoComponent

];

@NgModule({
  declarations: [
    AppComponent,
    ...AUREOLE_V_COMPONENTS,
    ...PAGES,

  ],
  imports: [
    NbTooltipModule,
    NbButtonModule,
    NbEvaIconsModule,
    NbIconModule,
    CommonModule,
    NbCardModule,
    DragDropModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AureoleRoutingModule,
    AitUiModule.forRoot(environment),
    AitAuthModule.forRoot(environment),
    StoreModule.forRoot(
      { ...rootReducers, ...aureoleRootReducers },
      {
        initialState: {},
      }
    ),
    ...AIT_UI_MODULES,
    ...NB_UI_MODULES,
  ],
  providers: [
    ...AIT_UI_SERVICES,
    ReactionService,
    SyncApiConfigService,
    SyncPEService,
    RecommencedUserService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(router: Router) {
    console.log(router);
  }
}
