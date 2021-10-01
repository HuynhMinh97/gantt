import { AitAuthService, AitBaseComponent, AitEnvironmentService, AppState } from '@ait/ui';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbLayoutScrollService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { UserProfileService } from 'apps/ait-matching-webapp/src/app/services/user-profile.service';
import { OrderSkill, ProfileDto } from './user-profile';

@Component({
  selector: 'ait-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent  extends AitBaseComponent implements OnInit {

  constructor(
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
          is_working: false ,
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
  profile: ProfileDto;
  skillByCategoryTest = [
    {
      name: "TOP 5 ",
      data: ["JAVA",".NET CORE","PYTHON","ANRGULA"]
    },
    {
      name: "TOP 5 ",
      data: ["JAVA",".NET CORE","PYTHON","ANRGULA"]
    },
    {
      name: "TOP 5 ",
      data: ["JAVA",".NET CORE","PYTHON","ANRGULA"]
    }
  ]
  
  async ngOnInit(): Promise<void> {
    await this.findUserProfileByUserId();
    await this.getSkillByUserId();
    await this.getImg();
  }
  
  async findUserProfileByUserId(){
    await this.userProfileService.findProfile(this.user_id)
    .then((res) => {
     this.profile = res.data[0];
     let topSkill: OrderSkill;
     topSkill.name = "TOP 5";
     topSkill.data = [];
     this.profile.top_skills.forEach((skill) => {
      topSkill.data.push(skill);
     })  
     this.skillByCategory.push(topSkill);
    })
    console.log(this.profile); 
    console.log(this.skillByCategory);
  }

  async getSkillByUserId(){
    const from = 'sys_user/' + this.user_id;
    this.userProfileService.findSkillByUserId(from)
    .then((listSkill) => {
      for(let skill of listSkill.data){
        let isCategory = false;
        for(let i in this.skillByCategory){
          if(this.skillByCategory[i].name == skill.category){
            this.skillByCategory[i].data.push(skill)
            isCategory = true;
          }
        }
        if(!isCategory){
          const itemSkill = {} as OrderSkill;
          itemSkill.name = skill.category;
          itemSkill.data.push(skill);
          this.skillByCategory.push(itemSkill);
        }
      }
      
    });
  }

  open(link: string){
    this.router.navigateByUrl('/' + link);
  }

  async getImg(){
    await this.userProfileService.getFilesByFileKeys(this.url_avatar)
    .then((res) =>{
      console.log(res.data);
      this.avata = res.data[0];
    })
  }
  getImage = (file: any, isError = false) => {
    debugger
    if (!isError) {
      return this.safelyURL(file.data_base64, file.file_type)
    }
    return 'https://d30y9cdsu7xlg0.cloudfront.net/png/47682-200.png';
  }
  safelyURL = (data, type) => this.santilizer.bypassSecurityTrustUrl(`data:${type};base64, ${data}`);
}
