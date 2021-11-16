import { isArrayFull, isObjectFull, RESULT_STATUS } from '@ait/shared';
import { 
  AitAuthService, 
  AitBaseComponent, 
  AitConfirmDialogComponent, 
  AitEnvironmentService, 
  AppState, 
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
  ProfileDto, } from './user-profile';
import { UserProfileService } from '../../../../services/user-profile.service';
import { UserProjectService } from '../../../../services/user-project.service';
import { UserReoderSkillsService } from '../../../../services/user-reoder-skills.service';
import { UserExperienceService } from '../../../../services/user-experience.service';
import { UserCerfiticateService } from '../../../../services/user-certificate.service';
import { UserCourseService } from '../../../../services/user-course.service';
import { UserEducationService } from '../../../../services/user-education.service';
import { UserLanguageService } from 'apps/ait-matching-webapp/src/app/services/user-language.service';
import { UserCourseComponent } from '../user-course/user-course.component';
import { UserProjectComponent } from '../user-project/user-project/user-project.component';
import { UserSkillsComponent } from '../user-skills/user-skills.component';
import { UserReorderSkillsComponent } from '../user-reorder-skills/user-reorder-skills.component';
import { UserExperienceComponent } from '../user-experience/user-experience.component';
import { UsesCertificateComponent } from '../uses-certificate/uses-certificate.component';
import { UserEducationComponent } from '../user-education/user-education.component';
import { UserLanguageComponent } from '../user-language/user-language.component';
import { UserOnboardingComponent } from '../user-onboarding/user-onboarding.component';

@Component({
  selector: 'ait-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent  extends AitBaseComponent implements OnInit {
  mode='';
  profileId = '';
  showProject = false;
  showSkill = false;
  showExperience = false;
  showCertificate = false;
  showCourse = false;
  showEducation = false;
  showLanguages = false;
  url_avatar: string = '';
  url_background: string = ''; 
  avata: any;
  skillByCategory: OrderSkill[] = [];
  userProject: any = [];
  userExperience: any = [];
  userCentificate: CertificateDto[] = [];
  userCourse: CourseDto[] = [];
  userEducation: EducationDto[] = [];
  userLanguage: LanguageDto[] = [];
  DataUserProfile: ProfileDto;
  topSkills = [];
  quantitySkill = 0;
  timeProject = 0;
  sumHoursProject="";
  timeExperience = 0;
  timeExperienceStr = "Ban chua co nam kn nào";
  countCentificate = '';
  countCourse = "You have finished 0 courses"
  dateFormat = "dd/MM/yyyy";
  today = Date.now();
  isMyUserProfile = false;
  countSkill="You has 0 skills. Each person has max 50 skills";
  actionBtn = [
    {
      title: '追加',
      icon: 'plus'
    }
  ];
  constructor(
    private userLanguageService: UserLanguageService,
    private userEducationService: UserEducationService,
    private userCourseService: UserCourseService,
    private userCetificateService: UserCerfiticateService,
    private userExperienceService: UserExperienceService,
    private userProjectService: UserProjectService,
    private reoderSkillsService : UserReoderSkillsService,
    private userProfileService: UserProfileService,
    private dialogService: NbDialogService,
    public activeRouter: ActivatedRoute,
    private router: Router,
    private santilizer: DomSanitizer,
    store: Store<AppState>,
    authService: AitAuthService,
    apollo: Apollo,
    env: AitEnvironmentService,
    layoutScrollService: NbLayoutScrollService,
    toastrService: NbToastrService,
  ) {   
    super(store, authService, apollo, null, env, layoutScrollService,toastrService);
    store.pipe(select(getUserSetting)).subscribe((setting) => {
      if (isObjectFull(setting) && setting['date_format_display']) {
        this.dateFormat = setting['date_format_display'];
      }
    });
    this.profileId = this.activeRouter.snapshot.paramMap.get('id');
    if (this.profileId && this.profileId != this.user_id) {     
      this.mode = MODE.VIEW;         
    }else{
      this.profileId = this.user_id;
      this.mode = MODE.EDIT;
      this.isMyUserProfile = true;
    }
  }
  
  async ngOnInit(): Promise<void> {
    this.callLoadingApp();
    await this.getMasterData();
    this.getUserProfileByUserId();
    this.getSkillByUserId();
    this.getProjectByUserId();
    this.getExperiencByUserId()
    this.getCentificateByUserId();
    this.getCourseByUserId();
    this.getEducationByUserId();
    this.getLanguageByUserId();
    setTimeout(() => {
      this.cancelLoadingApp();
    },1000)
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
  getDateFormat(time: number) {
    if (!time) {
      return '';
    } else {
      return dayjs(time).format(this.dateFormat.toUpperCase());
    }
  }

  async getUserProfileByUserId(){
    await this.userProfileService.findProfile(this.profileId)
    .then((res) => {
      if (res.status === RESULT_STATUS.OK) {   
        if(res.data.length > 0 ){  
          const data = res.data[0]
          this.DataUserProfile = data;
        } else{
          this.router.navigate([`/404`]);    
        }
      }  
    })
   
  }

  async getSkillByUserId(){
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
          if(data.length > 0 ){
            this.showSkill = true;
          }
          this.countSkill = 'You has '+ data.length + ' skills. Each person has max 50 skills';
          this.quantitySkill = data.length;
          let top5 = {} as OrderSkill;
          top5.name = "TOP 5";
          top5.data = [];
          if(this.topSkills.length > 0){
            for(let item of data){
              for(let topskill of this.topSkills){
                if(topskill._key == item._key){
                  top5.data.push(item.name);
                  break
                }
              }
            }
          }
          this.skillByCategory.push(top5);
          data.forEach((item) => {
            let isCategory = false;
            this.skillByCategory.forEach((element, index) =>{
              if(item.category == element.name){
                this.skillByCategory[index].data.push(item.name);
                isCategory = true;
              }
            })
            if(!isCategory){
              let skillsGroup = {} as OrderSkill;
              skillsGroup.name = item.category;
              skillsGroup.data = [];      
              skillsGroup.data.push(item.name);
              this.skillByCategory.push(skillsGroup);
            }
          });       
      }
    }) 
  }

  async getProjectByUserId(){
    await this.userProjectService.getProjectByUserId(this.profileId)
    .then(async (res) => {
      const company_values = Array.from(new Set(res.data.map(m => m?.company_working?.value))).filter(f => !!f);
      const companyUserProjects = this.groupBy(res.data, p => p.company_working?.value);     
      const datacompany = company_values.map(element => {   
        var timeworkingInfo = 0;   
        companyUserProjects.get(element).forEach(e => {
          timeworkingInfo += this.dateDiffInMonths(e.start_date_from,e.start_date_to);
        });
          this.timeProject += timeworkingInfo;
          return {
            company_name : element,
            data_project : companyUserProjects.get(element),
            working_time: timeworkingInfo,
          }
        }); 
        setTimeout(() => {
          this.userProject = datacompany;
          this.showProject = this.userProject.length > 0 ? true : false;
        },1000);              
      this.sumHoursProject = this.timeProject >0 ? "You have spent " + this.timeProject*180 + " hours working on the projects" : "Bạn chưa tham gia dự án nào vui lòng thêm."              
    })
    
  }

  getExperiencByUserId(){
    this.userExperienceService.findUserExperienceByUserId(this.profileId)
    .then(async (res) => { 
      if (res?.status === RESULT_STATUS.OK && res.data.length > 0) {
        const company_values = Array.from(new Set(res.data.map(m => m?.company_working?.value))).filter(f => !!f);
        const companyUserExps = this.groupBy(res.data, p => p.company_working?.value);
        const datacompany = company_values.map(element => {   
          var timeworkingInfo = 0;   
          companyUserExps.get(element).forEach(e => {
            timeworkingInfo += this.dateDiffInMonths(e.start_date_from,e.start_date_to);
          });
            this.timeExperience += timeworkingInfo;
            return {
              company_name : element,
              data_project : companyUserExps.get(element),
              working_time: timeworkingInfo,
            }
        }); 
        setTimeout(() => {
          this.userExperience = datacompany;
          this.showExperience =  this.userExperience.length > 0 ? true : false;
          console.log(this.userExperience);
          
        },1000); 
      this.timeExperienceStr = 'You have ' + this.dateDiffInYears(this.timeExperience) + ' experience working'     
      }   
    })
    
  }

  getCentificateByUserId(){
    this.userCetificateService.findUserCetificateByKey(this.profileId)
    .then((res) => {
      const data = res.data;    
      for(let element of data){
        let centificate = {} as CertificateDto;
        let datefrom = element.issue_date_from;
        let dateTo = element.issue_date_to;
        if(!datefrom){
          datefrom = Date.now();
        }
        if(!dateTo){
          dateTo = Date.now();
        }
        centificate._key = element._key;
        centificate.issue_by = element.issue_by?.value;
        centificate.issue_date_from = this.getDateFormat(element.issue_date_from);
        centificate.issue_date_to =element.issue_date_to ? this.getDateFormat(element.issue_date_to): 'Present';
        centificate.name = element.name?.value ;
        this.userCentificate.push(centificate);
      }
      setTimeout(() => {
        this.countCentificate = 'You have '+ this.userCentificate.length + ' certificates';

      },100)
      
    })
  }
  getCourseByUserId(){
    this.userCourseService.findCourseByUserId(this.profileId)
    .then((res) => {          
      const data = res.data;
      for(let element of data){
        let course = {} as CourseDto;
        let datefrom = element.start_date_from;
        let dateTo = element.start_date_to;
        if(!datefrom){
          datefrom = Date.now();
        }
        if(!dateTo){
          dateTo = Date.now();
        }
        course._key = element._key;
        course.name = element.name;
        course.start_date_from = this.getDateFormat(element.start_date_from);
        course.start_date_to = element.start_date_to ? this.getDateFormat(element.start_date_to) : 'Present';
        course.training_center = element.training_center?.value;
        this.userCourse.push(course);
      }      
      this.countCourse = 'You have finished ' + this.userCourse.length + ' courses';
    })
  }
  getEducationByUserId(){
    this.userEducationService.findUserEducationByUserId(this.profileId)
    .then((res) => {          
      const data = res.data;
      for(let element of data){
        let education = {} as EducationDto;
        let datefrom = element.start_date_from;
        let dateTo = element.start_date_to;
        if(!datefrom){
          datefrom = Date.now();
        }
        if(!dateTo){
          dateTo = Date.now();
        }
        education._key = element._key;
        education.school = element.school?.value;
        education.start_date_from = this.getDateFormat(element.start_date_from);
        education.start_date_to = element.start_date_to ? this.getDateFormat(element.start_date_to) : 'Present';
        education.field_of_study = element.field_of_study;
        this.userEducation.push(education);
      }
      
    })
    console.log(this.userEducation);
    
  }
  getLanguageByUserId(){
    this.userLanguageService.findUserLanguageByUserId(this.profileId)
    .then((res) => {          
      const data = res.data;
      for(let element of data){
        let language = {} as LanguageDto;
        let datefrom = element.start_date_from;
        let dateTo = element.start_date_to;
        if(!datefrom){
          datefrom = Date.now();
        }
        if(!dateTo){
          dateTo = Date.now();
        }
        language._key = element._key;
        language.language = element.language?.value;
        language.proficiency = element.proficiency?.value;
        if(element.language?._key == "en_US"){
          language.image = "../../../../../assets/images/english.png"
        }
        if(element.language?._key == "vi_VN"){
          language.image = "../../../../../assets/images/vietnam.png"
        }
        if(element.language?._key == "ja_JP"){
          language.image = "../../../../../assets/images/japan.png"
        }
        setTimeout(() => {
          this.userLanguage.push(language);
        },100)
      }
      
    })   
  }

  fomatDate(time: number){
    const day = time/1000/60/60/24;// milliseconds -> day
    if(day <= 31 ){
      return "1 Months";
    }else{
      let month = (day - day%30)/30 ;
      if(month < 12 ){
        return month.toString() + " Months";
      }else{
        let year = (month - month%12)/12;
        return (year.toString() + " Year " +  (month%12).toString() + " Months ");
      }
    }
  }

  openOnboarding(key?:string){ 
    this.dialogService.open(UserOnboardingComponent,{
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
        },300) 
      }
    });
  }

  openProjects(key?:string){ 
    this.dialogService.open(UserProjectComponent,{
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
        },500) 
      }
    });
  }
  openAddSkill(){ 
    this.dialogService.open(UserSkillsComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: true,
      autoFocus: false,
      context: {
      },
    }).onClose.subscribe(async (event) => {
      if (event) {
        this.callLoadingApp();
        this. skillByCategory = [];
        this.getSkillByUserId();
        setTimeout(() => {
          this.cancelLoadingApp();
        },500)
      }
    });
  }
  openReorderSkill(){ 
    this.dialogService.open(UserReorderSkillsComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: true,
      autoFocus: false,
      context: {
      },
    }).onClose.subscribe(async (event) => {
      if (event) {
        this.callLoadingApp();
        this. skillByCategory = [];
        this.getSkillByUserId();
        setTimeout(() => {
          this.cancelLoadingApp();
        },500)
      }
    });
  }
  openExperience(key?:string){ 
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
        },500)
      }
    });
  }
  openCertificate(key?:string){ 
    this.dialogService.open(UsesCertificateComponent, {
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
        },500)
      }
    });
  }
  openCourse(key?:string){ 
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
        },500)
      }
    });
  }
  openEducation(key?:string){ 
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
        },500)
      }
    });
  }
  openLanguage(key?:string){ 
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
        },500)
      }
    });
  }

  async getImg(){
    await this.userProfileService.getFilesByFileKeys(this.url_avatar)
    .then((res) =>{
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

  getHours(time: number){
    return Math.trunc(time/1000/60/60/3)
  }

  toggleContent(group: string, status: boolean) {
    this.isOpen[group] = status;
  }

  dateDiffInYears(month){
    if(month < 12){
      return month.toString() + " month";
    }else{
      const year = Math.trunc(month/12).toString();
      month = (month%12)
      if(month == 0){
        return year + "year";
      }else{
        return year + "year " + month.toString() +   " month";
      }
    }
  }

  dateDiffInMonths(startDate, endDate) {
    startDate = new Date(startDate);
    if(!endDate) {
      endDate = new Date();
    } else {
      endDate = new Date(endDate);
    }
    let months;
    months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months += (endDate.getMonth() - startDate.getMonth());
    if(months == 0){
      return 1;
    }else{
      return months;
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


  _unixtimeToDate = (unix_time: number) => {
    const result = new Date(unix_time);
    return result;
  }
}
