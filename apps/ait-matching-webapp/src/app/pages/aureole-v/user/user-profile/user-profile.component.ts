import { isArrayFull, isObjectFull, RESULT_STATUS } from '@ait/shared';
import { 
  AitAuthService, 
  AitBaseComponent, 
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
  ExperienDto, 
  GroupExperienceDto, 
  GroupProjectDto, 
  LanguageDto, 
  OrderSkill, 
  ProfileDto, 
  ProjectDto,} from './user-profile';
import { UserProfileService } from '../../../../services/user-profile.service';
import { UserProjectService } from '../../../../services/user-project.service';
import { UserReoderSkillsService } from '../../../../services/user-reoder-skills.service';
import { UserExperienceService } from '../../../../services/user-experience.service';
import { UserCerfiticateService } from '../../../../services/user-certificate.service';
import { UserCourseService } from '../../../../services/user-course.service';
import { UserEducationService } from '../../../../services/user-education.service';
import { UserLanguageService } from 'apps/ait-matching-webapp/src/app/services/user-language.service';

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
  userProject: GroupProjectDto[] = [];
  userExperience: GroupExperienceDto[] = [];
  userCentificate: CertificateDto[] = [];
  userCourse: CourseDto[] = [];
  userEducation: EducationDto[] = [];
  userLanguage: LanguageDto[] = [];
  userProfile: ProfileDto;
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
    if (this.profileId) {
      this.mode = MODE.VIEW;
    }else{
      this.profileId = this.user_id;
      this.mode = MODE.EDIT;
      this.isMyUserProfile = true;
    }
  }
  
  async ngOnInit(): Promise<void> {
    await this.getMasterData();
    this.findUserProfileByUserId();
    this.getSkillByUserId();
    this.getProjectByUserId();
    this.getExperiencByUserId()
    this.getCentificateByUserId();
    this.getCourseByUserId();
    this.getEducationByUserId();
    this.getLanguageByUserId();
    await this.getImg();
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
  async findUserProfileByUserId(){
    await this.userProfileService.findProfile(this.profileId)
    .then((res) => {
      if (res.status === RESULT_STATUS.OK) {       
          const data = res.data[0];
          let profile = {} as ProfileDto;
          profile.city = data.city?.value;
          profile.user_id = data.user_id;
          profile.last_name = data.last_name ? data.last_name : '';
          profile.first_name = data.first_name ? data.first_name : '';
          profile.title = data.title?.value;
          profile.company_working = data.company_working?.value;
          profile.country = data.country?.value;
          profile.about = data.about;
          profile.top_skills = data.top_skills.length > 0 ? data.top_skills : [];
          setTimeout(() =>{
            this.userProfile = profile;  
            let topSkill = {} as OrderSkill;
            topSkill.name = "TOP 5";
            topSkill.data = [];
           if(this.userProfile.top_skills.length > 0){
            this.userProfile.top_skills.forEach((skill) => {
              topSkill.data.push(skill.value);
             })  
             this.skillByCategory.push(topSkill);
           }   
           console.log(this.userProfile);        
          },200)

        }else{
          this.router.navigate([`/404`]);    
        }
         
    })
   
  }

  async getSkillByUserId(){
    const from = 'sys_user/' + this.profileId;
    await this.reoderSkillsService.findReorder(from).then(async (res) => {
      if (res.status === RESULT_STATUS.OK) {       
          const data = res.data;
          if(data.length > 0 ){
            this.showSkill = true;
          }
          this.countSkill = 'You has '+ data.length + ' skills. Each person has max 50 skills';
          this.quantitySkill = data.length;
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
      const data = res.data;
      for(let item in data){
        let isProject = false;
        for(let index in this.userProject){        
          if(this.userProject[index].company_name == data[item].company_working){
            isProject = true;
            let project = {} as ProjectDto;
            let dayNow = Date.now();
            let dateTo = data[item].start_date_to;
            project.is_working = false;
            if(!dateTo || dateTo > dayNow ){
              dateTo = dayNow;
              project.is_working = true;
            }
            project.name = data[item].name;
            project.title = data[item].title;
            project._key = data[item]._key;
            project.time = await this.fomatDate(dateTo - data[item].start_date_from );
            project.start_date_from = this.getDateFormat(data[item].start_date_from);
            project.start_date_to = data[item].start_date_to ? this.getDateFormat(data[item].start_date_to): "Present";          
            this.userProject[index].data.push(project);
            this.userProject[index].date = (this.userProject[index].date + (dateTo - data[item].start_date_from));
            this.userProject[index].working_time = this.fomatDate(this.userProject[index].date);
            this.timeProject += (dateTo - data[item].start_date_from);
          }
        }
        if(!isProject){   
          let groupProject = {} as GroupProjectDto;       
          groupProject.company_name = data[item].company_working;
          let project = {} as ProjectDto;
          let dayNow = Date.now();
          let dateTo = data[item].start_date_to;
          project.is_working = false;
          project.name = data[item].name;
          project.title = data[item].title;     
          if(!dateTo || dateTo > dayNow){
            dateTo = dayNow;
            project.is_working = true;
          }
          project._key = data[item]._key;
          project.time = await this.fomatDate(dateTo - data[item].start_date_from )
          project.start_date_from = this.getDateFormat(data[item].start_date_from);
          project.start_date_to = data[item].start_date_to ? this.getDateFormat(data[item].start_date_to): "Present";      
          groupProject.data = [];
          groupProject.data.push(project);
          groupProject.working_time = project.time;
          groupProject.date = (dateTo - data[item].start_date_from);
          this.userProject.push(groupProject);
          this.timeProject += (dateTo - data[item].start_date_from);
        }
      };
      this.timeProject = this.getHours(this.timeProject);
      this.sumHoursProject = this.timeProject >0 ? "You have spent " + this.timeProject + " hours working on the projects" : "Bạn chưa tham gia dự án nào vui lòng thêm."
      console.log(this.timeProject);      
    })
    
  }
  getHours(time: number){
    return Math.trunc(time/1000/60/60/3)
  }
  getExperiencByUserId(){
    this.userExperienceService.findUserExperienceByUserId(this.profileId)
    .then(async (res) => { 
      if (res?.status === RESULT_STATUS.OK && res.data.length > 0) {
        const data = res.data;
      for(let item in data){
        let isExperience = false;
        for(let index in this.userExperience){        
          if(this.userExperience[index].company_working == data[item].company_working?.value){
            isExperience = true;
            let experience = {} as ExperienDto;
            let dayNow = Date.now();
            let dateTo = data[item].start_date_to;
            experience.is_working = false;
            if(!dateTo || dateTo > dayNow){
              dateTo = dayNow;
              experience.is_working = true;
            }
            experience.title = data[item].title?.value;
            experience.employee_type = data[item].employee_type?.value;
            experience._key = data[item]._key;
            experience.time = await this.fomatDate(dateTo - data[item].start_date_from );
            experience.start_date_from = this.getDateFormat(data[item].start_date_from);
            experience.start_date_to = data[item].start_date_to ? this.getDateFormat(data[item].start_date_to): "Present";          
            this.userExperience[index].data.push(experience);
            this.userExperience[index].date = (this.userProject[index].date + (dateTo - data[item].start_date_from));
            this.userExperience[index].working_time = this.fomatDate(this.userProject[index].date);
            this.timeExperience += (dateTo - data[item].start_date_from);
          }
        }
        if(!isExperience){   
          let groupExperience = {} as GroupExperienceDto;       
          groupExperience.company_working = data[item].company_working?.value;
          let experience = {} as ExperienDto;
          let dayNow = Date.now();
          let dateTo = data[item].start_date_to;
          experience.is_working = false;
          if(!dateTo || dateTo > dayNow){
            dateTo = Date.now();
            experience.is_working = true;
          }
          experience.title = data[item].title?.value;
          experience.employee_type = data[item].employee_type?.value;
          experience._key = data[item]._key;
          experience.time = await this.fomatDate(dateTo - data[item].start_date_from );
          experience.start_date_from = this.getDateFormat(data[item].start_date_from);
          experience.start_date_to = data[item].start_date_to ? this.getDateFormat(data[item].start_date_to): "Present";     
          groupExperience.data = [];
          groupExperience.data.push(experience);
          groupExperience.working_time = experience.time;
          groupExperience.date = (dateTo - data[item].start_date_from);
          this.userExperience.push(groupExperience);
          this.timeExperience += (dateTo - data[item].start_date_from);
        }
      };
      let sumDate = await this.fomatDate( this.timeExperience);
      this.timeExperienceStr = 'You have ' + sumDate + ' experience working'     
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
        centificate.issue_date_to =element.issue_date_from ? this.getDateFormat(element.issue_date_from): 'Present';
        centificate.name = element.name?.value ? element.name?.value : "Đang đợi logic data";
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

  async subtractionDate(from: number, to: number){
    const fromDay = new Date(from);
    const toDay = new Date(to);
    const day = (to - from)/1000/60/60/24;// milliseconds -> day
    if(day <= 31 ){
      return "1 Month";
    }else{
      let month = (day - day%30)/30 ;
      if(month < 12 ){
        return month.toString() + " Month";
      }else{
        let year = (month - month%12)/12;
        return (year.toString() + " Year " +  (month%12).toString() + " Month ");
      }
    }
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

  open(link?: string){
    this.router.navigateByUrl('/' + link);
  }

  openProject(table: string, id?: string){
    this.router.navigateByUrl('/' + table + "/" + id);
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
  toggleContent(group: string, status: boolean) {
    this.isOpen[group] = status;
  }
}
