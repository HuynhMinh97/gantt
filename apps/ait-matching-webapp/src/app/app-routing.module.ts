import { EditDataMasterComponent } from './pages/master-group-collection/edit-data-master/edit-data-master.component';
import { SkillDetailComponent } from './pages/list/skill-list/skill-detail/skill-detail.component';
import { AddCationComponent } from './pages/list/caption-list/add-caption/add-caption.component';
import { CreateUserComponent } from './pages/list/user-list/create-user/create-user.component';
import { GroupRoleListComponent } from './pages/group-role/group-role-list/group-role-list.component';
import { GroupRoleRegisterComponent } from './pages/group-role/group-role-register/group-role-register.component';
import { UserOnboardingComponent } from './pages/user/user-onboarding/user-onboarding.component';
import { UserLanguageComponent } from './pages/user/user-language/user-language.component';
import { UserEducationComponent } from './pages/user/user-education/user-education.component';
import { UserExperienceComponent } from './pages/user/user-experience/user-experience.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AitAuthGuardService } from '@ait/ui';
import { RecommencedUserComponent } from './pages/recommenced-user/recommenced-user.component';
import { UserCourseComponent } from './pages/user/user-course/user-course.component';
import { UserCertificateComponent } from './pages/user/user-certificate/user-certificate.component';
import { UserSkillsComponent } from './pages/user/user-skills/user-skills.component';
import { UserReorderSkillsComponent } from './pages/user/user-reorder-skills/user-reorder-skills.component';
import { UserProfileComponent } from './pages/user/user-profile/user-profile.component';
import { UserJobAlertComponent } from './pages/user/user-job-alert/user-job-alert.component';
import { UserLanguageDetailComponent } from './pages/user/user-language-detail/user-language-detail.component';
import { UserEducationDetailComponent } from './pages/user/user-education-detail/user-education-detail.component';
import { UserExperienceDetailComponent } from './pages/user/user-experience-detail/user-experience-detail.component';
import { UserOnboardingDetailComponent } from './pages/user/user-onboarding-detail/user-onboarding-detail.component';
import { UserJobAlertDetailComponent } from './pages/user/user-job-alert-detail/user-job-alert-detail.component';
import { UserProjectComponent } from './pages/user/user-project/user-project.component';
import { ProjectListComponent } from './pages/list/project-list/project-list.component';
import { SkillListViewComponent } from './pages/list/skill-list/skill-list.component';
import { CertificateListComponent } from './pages/list/certificate-list/certificate-list.component';
import { EducationListComponent } from './pages/list/education-list/education-list.component';
import { UserCertificateDetailComponent } from './pages/user/user-certificate-detail/user-certificate-detail.component';
import { UserProjectDetailComponent } from './pages/user/user-project-detail/user-project-detail.component';
import { UserCourseDetailComponent } from './pages/user/user-course-detail/user-course-detail.component';
import { LanguageListComponent } from './pages/list/language-list/language-list.component';
import { RecommencedJobComponent } from './pages/recommenced/recommenced-job/recommenced-job.component';
import { AddRoleComponent } from './pages/group-role/add-role/add-role.component';
import { UserListComponent } from './pages/list/user-list/user-list.component';
import { AddSkillComponent } from './pages/list/skill-list/add-skill/add-skill.component';
import { CaptionListComponent } from './pages/list/caption-list/caption-list.component';
import { CaptionDetailComponent } from './pages/list/caption-list/caption-detail/caption-detail.component';
import { MasterDataListComponent } from './pages/master-data/master-data-list/master-data-list.component';
import { UserAccountDetailComponent } from './pages/list/user-list/user-account-detail/user-account-detail.component';
import { MasterListComponent } from './pages/master-group-collection/master-list/master-list.component';
import { ViewDataMasterComponent } from './pages/master-group-collection/view-data-master/view-data-master.component';
import { ProjectRequirementDetailComponent } from './pages/project-requirements/project-detail/project-requirement-detail.component';
import { RequirementListComponent } from './pages/requirement-list/requirement-list.component';
import { MasterDataInputComponent } from './pages/master-data/master-data-input/master-data-input.component';
import { MasterDataViewComponent } from './pages/master-data/master-data-view/master-data-view.component';
import { UpdateProjectComponent } from './pages/project-requirements/update-project/update-project.component';
import { SetPlanComponent } from './pages/recommenced-user/components/set-plan/set-plan.component';
import { GranttChartComponent } from './pages/grantt-chart/grantt-chart.component';
export const routes: Routes = [
  {
    path: 'recommenced-user',
    canActivate: [AitAuthGuardService],
    component: RecommencedUserComponent,
  },
  {
    path: 'recommenced-job',
    canActivate: [AitAuthGuardService],
    component: RecommencedJobComponent,
  },
  {
    path: 'user',
    canActivate: [AitAuthGuardService],
    component: UserOnboardingComponent,
  },
  {
    path: 'user-skills',
    canActivate: [AitAuthGuardService],
    component: UserSkillsComponent,
  },
  {
    path: 'user/:id',
    canActivate: [AitAuthGuardService],
    component: UserOnboardingComponent,
  },
  {
    path: 'user-detail/:id',
    canActivate: [AitAuthGuardService],
    component: UserOnboardingDetailComponent,
  },
  {
    path: 'user-course',
    canActivate: [AitAuthGuardService],
    component: UserCourseComponent,
  },
  {
    path: 'user-course/:id',
    canActivate: [AitAuthGuardService],
    component: UserCourseComponent,
  },
  {
    path: 'user-course-detail/:id',
    canActivate: [AitAuthGuardService],
    component: UserCourseDetailComponent,
  },
  {
    path: 'user-certificate-award',
    canActivate: [AitAuthGuardService],
    component: UserCertificateComponent,
  },
  {
    path: 'user-certificate-award/:id',
    canActivate: [AitAuthGuardService],
    component: UserCertificateComponent,
  },
  {
    path: 'user-certificate-award-detail/:id',
    canActivate: [AitAuthGuardService],
    component: UserCertificateDetailComponent,
  },
  {
    path: 'user-project',
    canActivate: [AitAuthGuardService],
    component: UserProjectComponent,
  },
  {
    path: 'user-project/:id',
    canActivate: [AitAuthGuardService],
    component: UserProjectComponent,
  },
  {
    path: 'user-project-detail/:id',
    canActivate: [AitAuthGuardService],
    component: UserProjectDetailComponent,
  },
  {
    path: 'user-skills-reorder',
    canActivate: [AitAuthGuardService],
    component: UserReorderSkillsComponent,
  },
  {
    path: 'user-skills',
    canActivate: [AitAuthGuardService],
    component: UserSkillsComponent,
  },
  {
    path: 'user-profile',
    canActivate: [AitAuthGuardService],
    component: UserProfileComponent,
  },
  {
    path: 'user-profile/:id',
    canActivate: [AitAuthGuardService],
    component: UserProfileComponent,
  },
  {
    path: 'user-experience',
    canActivate: [AitAuthGuardService],
    component: UserExperienceComponent,
  },
  {
    path: 'user-experience/:id',
    canActivate: [AitAuthGuardService],
    component: UserExperienceComponent,
  },
  {
    path: 'user-experience-detail/:id',
    canActivate: [AitAuthGuardService],
    component: UserExperienceDetailComponent,
  },
  {
    path: 'user-education',
    canActivate: [AitAuthGuardService],
    component: UserEducationComponent,
  },
  {
    path: 'user-education/:id',
    canActivate: [AitAuthGuardService],
    component: UserEducationComponent,
  },
  {
    path: 'user-education-detail/:id',
    canActivate: [AitAuthGuardService],
    component: UserEducationDetailComponent,
  },
  {
    path: 'user-language',
    canActivate: [AitAuthGuardService],
    component: UserLanguageComponent,
  },
  {
    path: 'user-language-detail/:id',
    canActivate: [AitAuthGuardService],
    component: UserLanguageDetailComponent,
  },
  {
    path: 'user-language/:id',
    canActivate: [AitAuthGuardService],
    component: UserLanguageComponent,
  },
  {
    path: 'user-job-alert',
    canActivate: [AitAuthGuardService],
    component: UserJobAlertComponent,
  },
  {
    path: 'user-job-alert/:id',
    canActivate: [AitAuthGuardService],
    component: UserJobAlertComponent,
  },
  {
    path: 'user-job-alert-detail/:id',
    canActivate: [AitAuthGuardService],
    component: UserJobAlertDetailComponent,
  },
  {
    path: 'skill-list',
    canActivate: [AitAuthGuardService],
    component: SkillListViewComponent,
  },
  {
    path: 'language-list',
    canActivate: [AitAuthGuardService],
    component: LanguageListComponent,
  },
  {
    path: 'project-list',
    canActivate: [AitAuthGuardService],
    component: ProjectListComponent,
  },
  {
    path: 'certificate-list',
    canActivate: [AitAuthGuardService],
    component: CertificateListComponent,
  },
  {
    path: 'education-list',
    canActivate: [AitAuthGuardService],
    component: EducationListComponent,
  },
  {
    path: 'role',
    canActivate: [AitAuthGuardService],
    component: AddRoleComponent,
  },
  {
    path: 'group-role',
    canActivate: [AitAuthGuardService],
    component: GroupRoleRegisterComponent,
  },
  {
    path: 'group-role-list',
    canActivate: [AitAuthGuardService],
    component: GroupRoleListComponent,
  },
  {
    path: 'user-list',
    canActivate: [AitAuthGuardService],
    component: UserListComponent,
  },
  {
    path: 'create-user',
    canActivate: [AitAuthGuardService],
    component: CreateUserComponent,
  },
  {
    path: 'user-account-detail/:id',
    canActivate: [AitAuthGuardService],
    component: UserAccountDetailComponent,
  },
  {
    path: 'skill',
    canActivate: [AitAuthGuardService],
    component: AddSkillComponent,
  },
  {
    path: 'skill/:id',
    canActivate: [AitAuthGuardService],
    component: AddSkillComponent,
  },
  {
    path: 'skill-detail/:id',
    canActivate: [AitAuthGuardService],
    component: SkillDetailComponent,
  },
  {
    path: 'caption-list',
    canActivate: [AitAuthGuardService],
    component: CaptionListComponent,
  },
  {
    path: 'caption',
    canActivate: [AitAuthGuardService],
    component: AddCationComponent,
  },
  {
    path: 'caption/:id',
    canActivate: [AitAuthGuardService],
    component: AddCationComponent,
  },
  {
    path: 'caption-detail/:id',
    canActivate: [AitAuthGuardService],
    component: CaptionDetailComponent,
  },
  {
    path: 'master-data',
    canActivate: [AitAuthGuardService],
    component: MasterDataListComponent,
  },
  {
    path: 'master-data/:id',
    canActivate: [AitAuthGuardService],
    component: MasterDataInputComponent,
  },
  {
    path: 'master-data-detail',
    canActivate: [AitAuthGuardService],
    component: MasterDataViewComponent,
  },
  {
    path: 'master-list',
    canActivate: [AitAuthGuardService],
    component: MasterListComponent,
  },
  {
    path: 'master/:id',
    canActivate: [AitAuthGuardService],
    component: EditDataMasterComponent,
  },
  {
    path: 'master',
    canActivate: [AitAuthGuardService],
    component: EditDataMasterComponent,
  },
  {
    path: 'master-detail/:id',
    canActivate: [AitAuthGuardService],
    component: ViewDataMasterComponent,
  },
  {
    path: 'project/:id',
    canActivate: [AitAuthGuardService],
    component: UpdateProjectComponent,
  },
  {
    path: 'project',
    canActivate: [AitAuthGuardService],
    component: UpdateProjectComponent,
  },
  {
    path: 'project-detail/:id',
    canActivate: [AitAuthGuardService],
    component: ProjectRequirementDetailComponent,
  },
  {
    path: 'requirement-list',
    canActivate: [AitAuthGuardService],
    component: RequirementListComponent,
  },
  {
    path: 'set-plan',
    canActivate: [AitAuthGuardService],
    component: SetPlanComponent,
  },
  {
    path: 'gantt-chart',
    canActivate: [AitAuthGuardService],
    component: GranttChartComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: localStorage.getItem('access_token')
      ? 'recommenced-user'
      : 'sign-in',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
