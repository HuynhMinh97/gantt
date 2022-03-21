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
import { UserProfileService } from '../../../services/user-profile.service';
import { UserProjectService } from '../../../services/user-project.service';
import { UserReoderSkillsService } from '../../../services/user-reoder-skills.service';
import { UserExperienceService } from '../../../services/user-experience.service';
import { UserCerfiticateService } from '../../../services/user-certificate.service';
import { UserCourseService } from '../../../services/user-course.service';
import { UserEducationService } from '../../../services/user-education.service';
import { UserLanguageService } from '../../../services/user-language.service';
import { MatchingUtils } from '../../../../../../../apps/ait-matching-webapp/src/app/@constants/utils/matching-utils';
import { UserSkillsService } from '../../../services/user-skills.service';

@Component({
  selector: 'ait-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent extends AitBaseComponent implements OnInit {
  mode = '';
  profileId = '';
  skills = '';

  isShowSkill = false;
  isShowCourse = false;
  isShowProject = false;
  isShowLanguages = false;
  isShowEducation = false;
  isShowExperience = false;
  isShowCertificate = false;

  heightSkill = '';
  heightProject = '';
  heightExperience = '';

  avata: any;
  url_avatar = '';
  DataUserProfile = {};
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
  actionBtnProfile = [
    {
      title: '追加',
      icon: 'edit-outline'
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
    try {
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
    } catch (e) {
      this.cancelLoadingApp();
    }
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

  nextPage(link: string, key?: string){
    if(key){
      this.router.navigate([`${link}/${key}`]);
    }else{
      this.router.navigate([`${link}`]);
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
            if(this.mode == MODE.VIEW) {
              this.router.navigate([`/404`]);
            }else{
              this.router.navigate([`user-onboarding`]);
            }
            
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
        if(res.status == RESULT_STATUS.OK && res.data.length > 0 ){
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
            this.getHieghtProject();
          }, 1000);
        }
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
            this.timeExperienceStr = this.dateDiffInYears(this.timeExperience);
            this.getHieghtExperience();
          }, 1000);   
        }else{
        }
      })
      
  }

  async getCentificateByUserId() {
    await this.userCetificateService.findUserCetificateByKey(this.profileId)
      .then((res) => {
        const data = res.data;
        this.countCentificate = data.length;
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
  getExpan(data, val){
    this[val] = true;
  }
  getHieghtProject(){
    if(this.userProject[0]?.data_project.length >=2 && !this.isShowProject){
      this.heightProject = '320px'
    }else if(this.userProject[0]?.data_project.length ==1 && !this.isShowProject){
      this.heightProject = '200px'
    }else{
      this.heightProject = '0px'
    }
  }
  getHieghtExperience(){
    if(this.userExperience[0]?.data_project.length >=2 && !this.isShowExperience){
      this.heightExperience = '320px'
    }else if(this.userExperience[0]?.data_project.length ==1 && !this.isShowExperience){
      this.heightExperience = '200px'
    }else{
      this.heightExperience = '0px'
    }
  }
}
