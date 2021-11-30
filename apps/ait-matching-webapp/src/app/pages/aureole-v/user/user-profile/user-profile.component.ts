/* eslint-disable @typescript-eslint/member-ordering */
import { isArrayFull, isObjectFull, RESULT_STATUS } from '@ait/shared';
import {
  AitAuthService,
  AitBaseComponent,
  AitEnvironmentService,
  AitTranslationService,
  AppState,
  getSettingLangTime,
  getUserSetting,
  MODE
} from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import dayjs from 'dayjs';
import {
  CertificateDto,
  CourseDto,
  EducationDto,
  LanguageDto,
  OrderSkill,
  ProfileDto,
} from './user-profile';
import { UserProfileService } from '../../../../services/user-profile.service';
import { UserProjectService } from '../../../../services/user-project.service';
import { UserReoderSkillsService } from '../../../../services/user-reoder-skills.service';
import { UserExperienceService } from '../../../../services/user-experience.service';
import { UserCerfiticateService } from '../../../../services/user-certificate.service';
import { UserCourseService } from '../../../../services/user-course.service';
import { UserEducationService } from '../../../../services/user-education.service';
import { UserLanguageService } from '../../../../services/user-language.service';
import { UserCourseComponent } from '../user-course/user-course.component';
import { UserSkillsComponent } from '../user-skills/user-skills.component';
import { UserReorderSkillsComponent } from '../user-reorder-skills/user-reorder-skills.component';
import { UserExperienceComponent } from '../user-experience/user-experience.component';
import { UserCertificateComponent } from '../user-certificate/user-certificate.component';
import { UserEducationComponent } from '../user-education/user-education.component';
import { UserLanguageComponent } from '../user-language/user-language.component';
import { UserOnboardingComponent } from '../user-onboarding/user-onboarding.component';
import { UserProjectComponent } from '../user-project/user-project.component';
import { UserProjectDetailComponent } from '../user-project-detail/user-project-detail.component';
import { UserExperienceDetailComponent } from '../user-experience-detail/user-experience-detail.component';
import { UserCertificateDetailComponent } from '../user-certificate-detail/user-certificate-detail.component';
import { UserCourseDetailComponent } from '../user-course-detail/user-course-detail.component';
import { UserEducationDetailComponent } from '../user-education-detail/user-education-detail.component';
import { UserLanguageDetailComponent } from '../user-language-detail/user-language-detail.component';
import { UserOnboardingDetailComponent } from '../user-onboarding-detail/user-onboarding-detail.component';
import { MatchingUtils } from '../../../../../../../../apps/ait-matching-webapp/src/app/@constants/utils/matching-utils';
import { UserSkillsService } from '../../../../services/user-skills.service';

@Component({
  selector: 'ait-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent extends AitBaseComponent implements OnInit {
  mode = '';
  profileId = '';
  skills = '';
  showSkill = false;
  showCourse = false;
  showProject = false;
  showLanguages = false;
  showEducation = false;
  showExperience = false;
  showCertificate = false;

  avata: any;
  url_avatar = '';
  DataUserProfile: ProfileDto;
  url_background = '';

  topSkills = [];
  userProject: any = [];
  userExperience: any = [];
  userCourse: CourseDto[] = [];
  userLanguage: LanguageDto[] = [];
  userEducation: EducationDto[] = [];
  skillByCategory: OrderSkill[] = [];
  userCentificate: CertificateDto[] = [];

  isload = false;
  isFriend = false;
  countFriend = 0;
  timeProject = 0;
  countCourse = 0;
  countSkill = 0;
  timeExperience = 0;
  countCentificate = 0;
  timeExperienceStr = '';
  maxSkill = 0;

  dateFormat = 'dd/MM/yyyy';
  monthFormat: any;
  today = new Date().setHours(0, 0, 0, 0);
  isMyUserProfile = false;
  actionBtn = [
    {
      title: '追加',
      icon: 'plus'
    }
  ];
  skillUserName: any;
  constructor(
    private userSkillsService: UserSkillsService,
    private userLanguageService: UserLanguageService,
    private userEducationService: UserEducationService,
    private userCourseService: UserCourseService,
    private userCetificateService: UserCerfiticateService,
    private userExperienceService: UserExperienceService,
    private userProjectService: UserProjectService,
    private reoderSkillsService: UserReoderSkillsService,
    private userProfileService: UserProfileService,
    private dialogService: NbDialogService,
    public activeRouter: ActivatedRoute,
    private translateService: AitTranslationService,
    private router: Router,
    private santilizer: DomSanitizer,
    store: Store<AppState>,
    authService: AitAuthService,
    apollo: Apollo,
    env: AitEnvironmentService,
    layoutScrollService: NbLayoutScrollService,
    toastrService: NbToastrService,
  ) {
    super(store, authService, apollo, null, env, layoutScrollService, toastrService);
    store.pipe(select(getUserSetting)).subscribe((setting) => {
      if (isObjectFull(setting) && setting['date_format_display']) {
        this.dateFormat = setting['date_format_display'];
      }
    });
    this.store.pipe(select(getSettingLangTime)).subscribe(setting => {
      if (setting) {
        const display = setting?.date_format_display;
        this.monthFormat = MatchingUtils.getFormatYearMonth(display);
      }
    });
    this.setModulePage({
      module: 'user',
      page: 'user_profiles',
    });
    this.profileId = this.activeRouter.snapshot.paramMap.get('id');
    if (this.profileId && this.profileId != this.user_id) {
      this.mode = MODE.VIEW;
    } else {
      this.profileId = this.user_id;
      this.mode = MODE.EDIT;
      this.isMyUserProfile = true;
    } 
    this.skills = this.translateService.translate('skills');
  }

  async ngOnInit(): Promise<void> {
    await this.getMasterData();
    await this.getMaxSkill();
    this.getFriends();
    this.getCountFriends();
    this.getUserProfileByUserId();
    this.getSkillByUserId();
    this.getProjectByUserId();
    this.getExperiencByUserId()
    this.getCentificateByUserId();
    this.getCourseByUserId();
    this.getEducationByUserId();
    this.getLanguageByUserId();
    this.getImg();
  }
  async getMasterData() {
    try {
      if (!this.dateFormat) {
        const masterValue = await this.getUserSettingData('USER_SETTING');
        const setting = await this.findUserSettingCode();
        if (isObjectFull(setting) && isArrayFull(masterValue)) {
          const format = setting['date_format_display'];
          const data = masterValue.find(item => item.code === format);
          if (data) {
            this.dateFormat = data['name'];
          }
        }
      }
    } catch (e) {
    }
  }
  async getMaxSkill(){
    await this.userSkillsService.getMaxSkill({value: ['maxSkill']})
    .then((res) => {
      this.maxSkill = parseInt(res.data[0].name);
    })
  }
  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase());
    }
  }

  async getUserProfileByUserId() {
    this.callLoadingApp();
    await this.userProfileService.findProfile(this.profileId)
      .then((res) => {
        if (res.status === RESULT_STATUS.OK) {
          if (res.data.length > 0) {
            const data = res.data[0]
            this.DataUserProfile = data;
            this.isload = true;
            this.cancelLoadingApp();
          } else {
            this.cancelLoadingApp();
            this.router.navigate([`/404`]);
          }
          this.timeExperienceStr = this.dateDiffInYears(this.timeExperience);
        }
      })
      this.cancelLoadingApp();
  }

  async getSkillByUserId() { 
    await this.userProfileService.findTopSkill(this.profileId)
      .then((res) => {
        const data = res.data[0]; 
        this.topSkills = [];
        this.topSkills = data.top_skills ? data.top_skills : [];
      })
    const from = 'sys_user/' + this.profileId;
    await this.reoderSkillsService.findReorder(from).then(async (res) => {
      if (res.status === RESULT_STATUS.OK) {
        const data = res.data;
        if (data.length > 0) {
          this.showSkill = true;
        }
        this.countSkill =  data.length ;
        const top5 = {} as OrderSkill;
        top5.name = this.translateService.translate('top 5');
        top5.data = [];
        if (this.topSkills.length > 0) {
          for (const item of data) {
            for (const topskill of this.topSkills) {
              if (topskill._key == item._key) {
                top5.data.push(item);
                break
              }
            }
          }
        }
        this.skillByCategory.push(top5);
        data.forEach((item) => {
          let isCategory = false;
          this.skillByCategory.forEach((element, index) => {
            if (item.category?.value == element.name) {
              this.skillByCategory[index].data.push(item);
              isCategory = true;
            }
          })
          if (!isCategory) {
            const skillsGroup = {} as OrderSkill;
            skillsGroup.name = item.category?.value;
            skillsGroup.code = item.category?._key;
            skillsGroup.data = [];
            skillsGroup.data.push(item);
            this.skillByCategory.push(skillsGroup);
          }
        });
      }      
    })  
    this.skillByCategory.forEach((element, index) => {
      if(element.code == 'OTHERS'){
        this.skillByCategory.push(element);
        this.skillByCategory.splice(index, 1 );
      }
    }); 
  }

  async getProjectByUserId() {
    this.timeProject = 0;
    await this.userProjectService.getProjectByUserId(this.profileId)
      .then(async (res) => {
        const company_values = Array.from(new Set(res.data.map(m => m?.company_working?.value))).filter(f => !!f);
        const companyUserProjects = this.groupBy(res.data, p => p.company_working?.value);

        const datacompany = company_values.map(element => {
          let timeworkingInfo = 0;         
          companyUserProjects.get(element).forEach(e => {
            timeworkingInfo += this.dateDiffInMonths(e.start_date_from, e.start_date_to);
          });
          this.timeProject += timeworkingInfo;
          return {
            company_name: element,
            data_project: companyUserProjects.get(element),
            working_time: timeworkingInfo,
          }
        });
        setTimeout(() => {
          this.userProject = datacompany;
          this.userProject.forEach(element => {
            element.data_project.forEach((item , index)=> {
              if(!item?.start_date_to){
                element.data_project.unshift(item);
                element.data_project.splice(index + 1,1);
              }
            });
          });
          this.showProject = this.userProject.length > 0 ? true : false;
        }, 1000);
      })
  }

  async getExperiencByUserId() {  
    this.callLoadingApp(); 
    this.timeExperience = 0;
    this.timeExperienceStr = this.dateDiffInYears(this.timeExperience);
    await this.userExperienceService.findUserExperienceByUserId(this.profileId)
      .then(async (res) => {
        if (res?.status === RESULT_STATUS.OK && res.data.length > 0) {
          const company_values = Array.from(new Set(res.data.map(m => m?.company_working?.value))).filter(f => !!f);
          const companyUserExps = this.groupBy(res.data, p => p.company_working?.value);
          const datacompany = company_values.map(element => {
            let timeworkingInfo = 0;
            companyUserExps.get(element).forEach(e => {
              timeworkingInfo += this.dateDiffInMonths(e.start_date_from, e.start_date_to);
            });
            this.timeExperience += timeworkingInfo;
            return {
              company_name: element,
              data_project: companyUserExps.get(element),
              working_time: timeworkingInfo,
            }
          });
          setTimeout(() => {
            this.userExperience = datacompany;
            this.userExperience.forEach(element => {
              element.data_project.forEach((item , index)=> {
                if(!item?.start_date_to){
                  element.data_project.unshift(item);
                  element.data_project.splice(index + 1,1);
                }
              });
            });
            this.showExperience = this.userExperience.length > 0 ? true : false;
            this.timeExperienceStr = this.dateDiffInYears(this.timeExperience);
            // this.cancelLoadingApp();
          }, 1000);   
        }else{
          // this.cancelLoadingApp();
        }
      })
      
  }

  async getCentificateByUserId() {
    await this.userCetificateService.findUserCetificateByKey(this.profileId)
      .then((res) => {
        const data = res.data;
        this.countCentificate = data.length;
        this.showCertificate = data.length > 0 ? true : false;
        for (const element of data) {
          const centificate = {} as CertificateDto;
          let datefrom = element.issue_date_from;
          let dateTo = element.issue_date_to;
          if (!datefrom) {
            datefrom = Date.now();
          }
          if (!dateTo) {
            dateTo = Date.now();
          }
          centificate._key = element._key;
          centificate.issue_by = element.issue_by?.value;
          centificate.issue_date_from = element.issue_date_from;
          centificate.issue_date_to = element.issue_date_to;
          centificate.name = element.name?.value;
          this.userCentificate.push(centificate);
        }
      })
  }
  getCourseByUserId() {
    this.userCourseService.findCourseByUserId(this.profileId)
      .then((res) => {
        const data = res.data;
        this.countCourse = data.length;
        this.showCourse = data.length > 0 ? true : false;
        for (const element of data) {
          const course = {} as CourseDto;
          let datefrom = element.start_date_from;
          let dateTo = element.start_date_to;
          if (!datefrom) {
            datefrom = Date.now();
          }
          if (!dateTo) {
            dateTo = Date.now();
          }
          course._key = element._key;
          course.name = element.name;
          course.start_date_from = element.start_date_from;
          course.start_date_to = element.start_date_to;
          course.training_center = element.training_center?.value;
          this.userCourse.push(course);
        }
      })
  }
  getEducationByUserId() {
    this.userEducationService.findUserEducationByUserId(this.profileId)
      .then((res) => {
        const data = res.data;
        this.showEducation = data.length > 0 ? true : false;
        for (const element of data) {
          const education = {} as EducationDto;
          let datefrom = element.start_date_from;
          let dateTo = element.start_date_to;
          if (!datefrom) {
            datefrom = Date.now();
          }
          if (!dateTo) {
            dateTo = Date.now();
          }
          education._key = element._key;
          education.school = element.school?.value;
          education.start_date_from = element.start_date_from;
          education.start_date_to = element.start_date_to ;
          education.field_of_study = element.field_of_study;
          this.userEducation.push(education);
        }

      })
  }
  getLanguageByUserId() {
    this.userLanguageService.findUserLanguageByUserId(this.profileId)
      .then((res) => {
        const data = res.data;
        this.showLanguages = data.length > 0 ? true : false;
        for (const element of data) {
          const language = {} as LanguageDto;
          let datefrom = element.start_date_from;
          let dateTo = element.start_date_to;
          if (!datefrom) {
            datefrom = Date.now();
          }
          if (!dateTo) {
            dateTo = Date.now();
          }
          language._key = element._key;
          language.language = element.language?.value;
          language.proficiency = element.proficiency?.value;
          if (element.language?._key == 'en_US') {
            language.image = '../../../../../assets/images/english.png'
          }
          if (element.language?._key == 'vi_VN') {
            language.image = '../../../../../assets/images/vietnam.png'
          }
          if (element.language?._key == 'ja_JP') {
            language.image = '../../../../../assets/images/flag.png'
          }
          setTimeout(() => {
            this.userLanguage.push(language);
          }, 100)
        }

      })
  }

  fomatDate(time: number) {
    const day = time / 1000 / 60 / 60 / 24;// milliseconds -> day
    if (day <= 31) {
      return '1 Months';
    } else {
      const month = (day - day % 30) / 30;
      if (month < 12) {
        return month.toString() + ' Months';
      } else {
        const year = (month - month % 12) / 12;
        return (year.toString() + ' Year ' + (month % 12).toString() + ' Months ');
      }
    }
  }

  openOnboarding(key?: string) {
    this.dialogService.open(UserOnboardingComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: true,
      autoFocus: false,
      context: {
        user_key: key,
      },
    }).onClose.subscribe(async (event) => {
      if (event) {
        this.callLoadingApp();
        this.DataUserProfile = null;
        await this.getUserProfileByUserId();
        setTimeout(() => {
          this.cancelLoadingApp();
        }, 300)
      }
    });
  }
  openOnboardingDetail(key?: string) {
    this.dialogService.open(UserOnboardingDetailComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: true,
      autoFocus: false,
      context: {
        user_key: key,
      },
    }).onClose.subscribe(async (event) => {
      if (event) {
      }
    });
  }

  openProjects(key?: string) {
    this.dialogService.open(UserProjectComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: true,
      autoFocus: false,
      context: {
        project_key: key,
      },
    }).onClose.subscribe(async (event) => {
      if (event) {
        this.callLoadingApp();
        this.userProject = [];
        this.timeProject = 0;
        await this.getProjectByUserId();
        setTimeout(() => {
          this.cancelLoadingApp();
        }, 1000)
      }
    });
  }
  openProjectsDetail(key?: string) {
    this.dialogService.open(UserProjectDetailComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: true,
      autoFocus: false,
      context: {
        user_key: key,
      },
    }).onClose.subscribe(async (event) => {
      if (event) {
      }
    });
  }
  openAddSkill() {
    this.dialogService.open(UserSkillsComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: true,
      autoFocus: false,
      context: {
      },
    }).onClose.subscribe(async (event) => {
      if (event) {
        this.callLoadingApp();
        this.skillByCategory = [];
        this.getSkillByUserId();
        setTimeout(() => {
          this.cancelLoadingApp();
        }, 500)
      }
    });
  }
  openReorderSkill() {
    this.dialogService.open(UserReorderSkillsComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: true,
      autoFocus: false,
      context: {
      },
    }).onClose.subscribe(async (event) => {
      if (event) {
        this.callLoadingApp();
        this.skillByCategory = [];
        this.getSkillByUserId();
        setTimeout(() => {
          this.cancelLoadingApp();
        }, 500)
      }
    });
  }
  openExperience(key?: string) {
    this.dialogService.open(UserExperienceComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: true,
      autoFocus: false,
      context: {
        user_key: key,
      },
    }).onClose.subscribe(async (event) => {
      if (event) {
        this.callLoadingApp();
        this.userExperience = [];
        this.getExperiencByUserId();
        setTimeout(() => {
          this.cancelLoadingApp();
        }, 1000)
      }
    });
  }
  openExperiencedetail(key?: string) {
    this.dialogService.open(UserExperienceDetailComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: true,
      autoFocus: false,
      context: {
        user_key: key,
      },
    }).onClose.subscribe(async (event) => {
      if (event) {
      }
    });
  }
  openCertificate(key?: string) {
    this.dialogService.open(UserCertificateComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: true,
      autoFocus: false,
      context: {
        certificate_key: key,
      },
    }).onClose.subscribe(async (event) => {
      if (event) {
        this.callLoadingApp();
        this.userCentificate = [];
        this.getCentificateByUserId();
        setTimeout(() => {
          this.cancelLoadingApp();
        }, 500)
      }
    });
  }
  openCertificateDetail(key?: string) {
    this.dialogService.open(UserCertificateDetailComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: true,
      autoFocus: false,
      context: {
        user_key: key,
      },
    }).onClose.subscribe(async (event) => {
      if (event) {}
    });
  }
  openCourse(key?: string) {
    this.dialogService.open(UserCourseComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: true,
      autoFocus: false,
      context: {
        course_key: key,
      },
    }).onClose.subscribe(async (event) => {
      if (event) {
        this.callLoadingApp();
        this.userCourse = [];
        this.getCourseByUserId();
        setTimeout(() => {
          this.cancelLoadingApp();
        }, 500)
      }
    });
  }
  openCourseDetail(key?: string) {
    this.dialogService.open(UserCourseDetailComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: true,
      autoFocus: false,
      context: {
        user_key: key,
      },
    }).onClose.subscribe(async (event) => {
      if (event) {
      }
    });
  }
  openEducation(key?: string) {
    this.dialogService.open(UserEducationComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: true,
      autoFocus: false,
      context: {
        user_key: key,
      },
    }).onClose.subscribe(async (event) => {
      if (event) {
        this.callLoadingApp();
        this.userEducation = [];
        this.getEducationByUserId();
        setTimeout(() => {
          this.cancelLoadingApp();
        }, 500)
      }
    });
  }
  openEducationDetail(key?: string) {
    this.dialogService.open(UserEducationDetailComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: true,
      autoFocus: false,
      context: {
        user_key: key,
      },
    }).onClose.subscribe(async (event) => {
      if (event) {
      }
    });
  }
  openLanguage(key?: string) {
    this.dialogService.open(UserLanguageComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: true,
      autoFocus: false,
      context: {
        user_key: key,
      },
    }).onClose.subscribe(async (event) => {
      if (event) {
        this.callLoadingApp();
        this.userLanguage = [];
        this.getLanguageByUserId();
        setTimeout(() => {
          this.cancelLoadingApp();
        }, 500)
      }
    });
  }
  openLanguageDetail(key?: string) {
    this.dialogService.open(UserLanguageDetailComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: true,
      autoFocus: false,
      context: {
        user_key: key,
      },
    }).onClose.subscribe(async (event) => {
      if (event) {
      }
    });
  }

  async getImg() {
    await this.userProfileService.getFilesByFileKeys(this.url_avatar)
      .then((res) => {
        console.log(res);       
      })
  }
  getImage = (file: any, isError = false) => {
    if (!isError) {
      return this.safelyURL(file.data_base64, file.file_type)
    }
    return 'https://d30y9cdsu7xlg0.cloudfront.net/png/47682-200.png';
  }
  safelyURL = (data, type) => this.santilizer.bypassSecurityTrustUrl(`data:${type};base64, ${data}`);
  
  isOpen = {
    userInfo: true,
    userTraining: true,
    userJobQuery: true,
    userCertificate: true,
  };

  dateDiffInYears(month) {
    const monthStr = this.translateService.translate('my-profile.months');
    const yearStr = this.translateService.translate('my-profile.years'); 
    if (month < 12) {
      return month.toString() + ' ' + monthStr;
    } else {
      const year = Math.trunc(month / 12).toString();
      month = (month % 12)
      if (month == 0) {
        return year + ' ' + yearStr;
      } else {
        return year + ' ' + yearStr + ' ' + month.toString() +' ' + monthStr;
      }
    }
  }

  dateDiffInMonths(startDate, endDate) {
    if(!startDate && !endDate){
      return 0
    }else{
      startDate = new Date(startDate);
      if (!endDate) {
        endDate = new Date();
      } else {
        endDate = new Date(endDate);
      }
      let months;
      months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
      months += (endDate.getMonth() - startDate.getMonth());
      if (months == 0) {
        return 1;
      } else {
        return months;
      }
    }
    
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  getCounter = (message, value) => {   
    const content = this.translateService.translate(message);
    return content.replace('{0}', value);
  }
  getCounterSkill = async (message, value) => { 
    const content = this.translateService.translate(message);
    return content.replace('{0}', value).replace('{1}', this.maxSkill.toString());
  }

  _unixtimeToDate = (unix_time: number) => {
    const result = new Date(unix_time);
    return result;
  }

  getCountFriends(){
    this.userProfileService.getCountFriends('sys_user/' + this.profileId)
    .then((res) => {
      if(res?.status == RESULT_STATUS.OK){
        this.countFriend = res.data.length;
      } 
    })
  }
  getFriends(){
    this.userProfileService.getFriends('sys_user/' + this.user_id)
    .then((res) => {
      if(res?.status == RESULT_STATUS.OK){
        if(res.data.length > 0)
        this.isFriend = true;
      } 
    })
  }
  saveFriends(){
    const friend = {
      _from: 'sys_user/' + this.user_id,
      _to: 'sys_user/' + this.profileId,
      relationship: 'love'
    }
    this.userProfileService.saveFriends(friend)
    .then((res) => {
      if(res?.status == RESULT_STATUS.OK){
        this.isFriend = true;
        this.countFriend += 1;
      }      
    })
  }
  deleteFriends(){
    const friend = [{
      _from: 'sys_user/' + this.user_id,
      _to: 'sys_user/' + this.profileId,
    }]
    this.userProfileService.removeFriends(friend)
    .then((res) => {
      if(res?.status == RESULT_STATUS.OK){
        this.isFriend = false;
        this.countFriend -= 1;
      }      
    })
  }
}
