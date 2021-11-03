import { debug } from 'node:console';
import { isArrayFull, isObjectFull, RESULT_STATUS } from '@ait/shared';
import { AitAuthService, AitBaseComponent, AitEnvironmentService, AppState, getUserSetting } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserProfileService } from 'apps/ait-matching-webapp/src/app/services/user-profile.service';
import { UserProjectService } from 'apps/ait-matching-webapp/src/app/services/user-project.service';
import { UserReoderSkillsService } from 'apps/ait-matching-webapp/src/app/services/user-reoder-skills.service';
import dayjs from 'dayjs';
import { CertificateDto, CourseDto, EducationDto, ExperienDto, GroupExperienceDto, GroupProjectDto, LanguageDto, OrderSkill, ProfileDto, ProjectDto, SkillsDto } from './user-profile';
import { UserExperienceService } from 'apps/ait-matching-webapp/src/app/services/user-experience.service';
import { UserCerfiticateService } from 'apps/ait-matching-webapp/src/app/services/user-certificate.service';
import { UserCourseService } from 'apps/ait-matching-webapp/src/app/services/user-course.service';
import { UserEducationService } from 'apps/ait-matching-webapp/src/app/services/user-education.service';
import { UserLanguageService } from 'apps/ait-matching-webapp/src/app/services/user-language.service';

@Component({
  selector: 'ait-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent  extends AitBaseComponent implements OnInit {

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
  }

  userprojectFilterByCmp =[
    {
      company_name:"Aureole 1 Information Technology Inc.",
      floor_building:"Ho Chi Minh City, Vietnam",
      street:"8 years 6 months",
      working_time:"8 years 6 months",
      data_project:[
        {
          is_working: true,
          name:'Technical 1 Manager 1',
          start_date_from:'09/2021',
          isEdited:'true',
          title:'FOR data IN sys_message FILTER'
        },
        {
          is_working: true ,
          name:'Technical 2 Manager 2',
          start_date_from:'09/2021',
          isEdited:'true',
          title:'FOR data IN sys_message FILTER'
        },
        {
          is_working: false,
          name:'Technical 3 Manager 3',
          start_date_from:'09/2021',
          isEdited:'true',
          title:'FOR data IN sys_message FILTER'
        }
      ]
    },
    {
      company_name:"Aureole 2 Information 2",
      floor_building:"Ho Chi Minh City, Vietnam",
      street:"8 years 6 months",
      working_time:"8 years 6 months",
      data_project:[
        {
          is_working:'false',
          name:'Technical Manager',
          start_date_from:'09/2021',
          isEdited:'true',
          title:'FOR data IN sys_message FILTER'
        }
      ]
    }
  ]
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
  profile: ProfileDto;
  quantitySkill = 0;
  timeProject = 0;
  timeExperience = 0;
  dateFormat = "dd/MM/yyyy";
  today = Date.now();
  isMyUserProfile = false;
  
  async ngOnInit(): Promise<void> {
    await this.getMasterData();
    await this.findUserProfileByUserId();
    await this.getSkillByUserId();
    await this.getProjectByUserId();
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
    await this.userProfileService.findProfile(this.user_id)
    .then((res) => {
      if( res.data[0].user_id == this.user_id){
        this.isMyUserProfile = true;
      }
     this.profile = res.data[0];
     let topSkill = {} as OrderSkill;
     topSkill.name = "TOP 5";
     topSkill.data = [];
     this.profile.top_skills.forEach((skill) => {
      topSkill.data.push(skill.value);
     })  
     this.skillByCategory.push(topSkill);
    })
    console.log(this.skillByCategory);
  }

  async getSkillByUserId(){
      const from = 'sys_user/' + this.user_id;
    await this.reoderSkillsService.findReorder(from).then(async (res) => {
      if (res.status === RESULT_STATUS.OK) {
        if(res.data.length > 0){
          const data = res.data;
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
      }
    }) 
  }

  async getProjectByUserId(){
    await this.userProjectService.getProjectByUserId(this.user_id)
    .then(async (res) => {
      const data = res.data;
      for(let item in data){
        let isProject = false;
        for(let index in this.userProject){        
          if(this.userProject[index].company_name == data[item].company_working){
            isProject = true;
            let project = {} as ProjectDto;
            let dateTo = data[item].start_date_to;
            project.is_working = false;
            if(!dateTo){
              dateTo = Date.now();
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
          let dateTo = data[item].start_date_to;
          project.is_working = false;
          project.name = data[item].name;
          project.title = data[item].title;     
          if(!dateTo){
            dateTo = Date.now();
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
      
      
    })
    console.log(this.userProject);
    
  }

  getExperiencByUserId(){
    this.userExperienceService.findUserExperienceByUserId(this.user_id)
    .then(async (res) => {     
      const data = res.data;
      for(let item in data){
        let isExperience = false;
        for(let index in this.userExperience){        
          if(this.userExperience[index].company_working == data[item].company_working?.value){
            isExperience = true;
            let experience = {} as ExperienDto;
            let dateTo = data[item].start_date_to;
            experience.is_working = false;
            if(!dateTo){
              dateTo = Date.now();
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
          let dateTo = data[item].start_date_to;
          experience.is_working = false;
          if(!dateTo){
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
      
    })
    console.log(this.userExperience);
    
  }

  getCentificateByUserId(){
    this.userCetificateService.findUserCetificateByKey(this.user_id)
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
        centificate.issue_date_to = this.getDateFormat(element.issue_date_from);
        centificate.name = element.name?.value ? element.name?.value : "Project Manager";
        this.userCentificate.push(centificate);
      }
      
    })
    console.log(this.userCentificate);
    
  }
  getCourseByUserId(){
    this.userCourseService.findCourseByUserId(this.user_id)
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
        course.start_date_to = this.getDateFormat(element.start_date_to);
        course.training_center = element.training_center?.value;
        this.userCourse.push(course);
      }
      
    })
    console.log(this.userCourse);
    
  }
  getEducationByUserId(){
    this.userEducationService.findUserEducationByUserId(this.user_id)
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
        education.start_date_to = this.getDateFormat(element.start_date_to);
        education.field_of_study = element.field_of_study;
        this.userEducation.push(education);
      }
      
    })
    console.log(this.userEducation);
    
  }
  getLanguageByUserId(){
    this.userLanguageService.findUserLanguageByUserId(this.user_id)
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
      
        this.userLanguage.push(language);
      }
      
    })
    console.log(this.userLanguage);
    
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

  open(link: string){
    this.router.navigateByUrl('/' + link);
  }

  openProject(table: string, id?: string){
    this.router.navigateByUrl('/' + table + "/" + id);
  }

  async getImg(){
    await this.userProfileService.getFilesByFileKeys(this.url_avatar)
    .then((res) =>{
      console.log(res.data);
      this.avata = res.data[0];
    })
  }
  getImage = (file: any, isError = false) => {
    if (!isError) {
      return this.safelyURL(file.data_base64, file.file_type)
    }
    return 'https://d30y9cdsu7xlg0.cloudfront.net/png/47682-200.png';
  }
  safelyURL = (data, type) => this.santilizer.bypassSecurityTrustUrl(`data:${type};base64, ${data}`);
}
