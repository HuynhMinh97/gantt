import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {
  AitAuthGuardService,
  AitAuthScreenService,
  AitChipModule,
  AitTabsModule,
  AitTocMenuModule,
  AitUiModule,
  rootReducers,
} from '@ait/ui';
import { AitAuthModule } from '@ait/auth';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
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
  NbDialogModule,
} from '@nebular/theme';
import { AitCardComponent } from './pages/recommenced-user/components/card/card.component';
import { ContentRowComponent } from './pages/recommenced-user/components/content/content.component';
import { CardSkeletonComponent } from './pages/recommenced-user/components/card-skeleton/card-skeleton.component';
import { RecommencedUserComponent } from './pages/recommenced-user/recommenced-user.component';
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
import { ProjectListComponent } from './pages/list/project-list/project-list.component';
import { LanguageListComponent } from './pages/list/language-list/language-list.component';
import { EducationListComponent } from './pages/list/education-list/education-list.component';
import { CertificateListComponent } from './pages/list/certificate-list/certificate-list.component';
import { SkillListViewComponent } from './pages/list/skill-list/skill-list.component';
import { MyProjectQueriesComponent } from './pages/my-project-queries/my-project-queries.component';
import { AddRoleComponent } from './pages/group-role/add-role/add-role.component';
import { GroupRoleRegisterComponent } from './pages/group-role/group-role-register/group-role-register.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { GroupRoleListComponent } from './pages/group-role/group-role-list/group-role-list.component';
import { RecommencedJobComponent } from './pages/recommenced/recommenced-job/recommenced-job.component';
import { SetNameComponent } from './pages/recommenced-user/components/set-name/set-name.component';
import { UserListComponent } from './pages/list/user-list/user-list.component';
import { CreateUserComponent } from './pages/list/user-list/create-user/create-user.component';
import { AddSkillComponent } from './pages/list/skill-list/add-skill/add-skill.component';
import { CaptionListComponent } from './pages/list/caption-list/caption-list.component';
import { AddCationComponent } from './pages/list/caption-list/add-caption/add-caption.component';
import { SkillDetailComponent } from './pages/list/skill-list/skill-detail/skill-detail.component';
import { CaptionDetailComponent } from './pages/list/caption-list/caption-detail/caption-detail.component';

const AIT_UI_MODULES = [AitChipModule, AitTabsModule, AitTocMenuModule];

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
  NbDialogModule,
];

const COMPONENTS = [
  AitCardComponent,
  ContentRowComponent,
  CardSkeletonComponent,
];

const PAGES = [
  RecommencedUserComponent,
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
  UserLanguageDetailComponent,
  UserEducationDetailComponent,
  UserCourseDetailComponent,
  UserCertificateDetailComponent,
  UserExperienceDetailComponent,
  UserProjectDetailComponent,
  UserOnboardingDetailComponent,
  CountryComponent,
  UserJobAlertDetailComponent,
  ProjectListComponent,
  LanguageListComponent,
  EducationListComponent,
  CertificateListComponent,
  SkillListViewComponent,
  DragScrollComponent,
  RecommencedJobComponent,
];

@NgModule({
  declarations: [
    AppComponent,
    ...COMPONENTS,
    ...PAGES,
    DragScrollComponent,
    MyProjectQueriesComponent,
    AddRoleComponent,
    GroupRoleRegisterComponent,
    GroupRoleListComponent,
    SetNameComponent,
    UserListComponent,
    CreateUserComponent,
    AddSkillComponent,
    CaptionListComponent,
    AddCationComponent,
    SkillDetailComponent,
    CaptionDetailComponent,
  ],
  imports: [
    Ng2SmartTableModule,
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
    AppRoutingModule,
    AitUiModule.forRoot(environment),
    AitAuthModule.forRoot(environment),
    StoreModule.forRoot(
      { ...rootReducers },
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
    RecommencedUserService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
