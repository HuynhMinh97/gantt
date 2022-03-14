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
import { AureoleVCardComponent } from './pages/recommenced-user/components/card/card.component';
import { ContentRowComponent } from './pages/recommenced-user/components/content/content.component';
import { CardSkeletonComponent } from './pages/recommenced-user/components/card-skeleton/card-skeleton.component';
import { RecommencedComponent } from './pages/recommenced-user/recommenced-user.component';
import { SyncApiConfigService } from './services/sync_api_config.service';
import { SyncPEService } from './services/sync_pe_history.service';
import { ReactionService } from './services/reaction.service';
import { RecommencedUserService } from './services/recommenced-user.service';
import { UserExperienceComponent } from './pages/user/user-experience/user-experience.component';
import { UserEducationComponent } from './pages/user/user-education/user-education.component';
import { UserLanguageComponent } from './pages/user/user-language/user-language.component';
import { UserOnboardingComponent } from './pages/user/user-onboarding/user-onboarding.component';
import { UserCourseComponent } from './pages/user/user-course/user-course.component';
import { UserCertificateComponent } from './pages/user/user-certificate/user-certificate.component';
import { UserSkillsComponent } from './pages/user/user-skills/user-skills.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UserProfileComponent } from './pages/user/user-profile/user-profile.component';
import { CommonModule } from '@angular/common';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { UserJobAlertComponent } from './pages/user/user-job-alert/user-job-alert.component';
import { UserReorderSkillsComponent } from './pages/user/user-reorder-skills/user-reorder-skills.component';
import { CardContentProfileComponent } from './pages/user/user-profile/card-content/card-content.component';
import { CountryComponent } from './components/country/country.component';
import { UserLanguageDetailComponent } from './pages/user/user-language-detail/user-language-detail.component';
import { UserEducationDetailComponent } from './pages/user/user-education-detail/user-education-detail.component';
import { UserCourseDetailComponent } from './pages/user/user-course-detail/user-course-detail.component';
import { UserCertificateDetailComponent } from './pages/user/user-certificate-detail/user-certificate-detail.component';
import { UserExperienceDetailComponent } from './pages/user/user-experience-detail/user-experience-detail.component';
import { UserProjectDetailComponent } from './pages/user/user-project-detail/user-project-detail.component';
import { UserOnboardingDetailComponent } from './pages/user/user-onboarding-detail/user-onboarding-detail.component';
import { UserJobAlertDetailComponent } from './pages/user/user-job-alert-detail/user-job-alert-detail.component';
import { UserProjectComponent } from './pages/user/user-project/user-project.component';
import { DragScrollComponent } from './pages/user/user-profile/drag-scroll/drag-scroll.component';

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
];

@NgModule({
  declarations: [
    AppComponent,
    ...AUREOLE_V_COMPONENTS,
    ...PAGES,
    DragScrollComponent,

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
