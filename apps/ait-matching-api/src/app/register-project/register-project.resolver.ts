import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RegisterProjectEntity } from './register-project.entity';
import { RegisterProjectRequest } from './register-project.request';
import { RegisterProjectResponse } from './register-project.response';


@Resolver()
export class RegisterProjectResolver extends AitBaseService {
  @Query(() => RegisterProjectResponse, { name: 'findProjectAitByKey' })
  async findProjectAitByKey(
    @Args('request', { type: () => RegisterProjectRequest })
    request: RegisterProjectRequest
  ) {
    return await this.find(request);
  }
  @Mutation(() => RegisterProjectResponse, { name: 'saveCompanyProject' })
  saveCompanyProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => RegisterProjectRequest })
    request: RegisterProjectRequest
  ) {
    return this.save(request);
  }

  @Query(() => RegisterProjectResponse, { name: 'findSkillProject' })
  async findSkillProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => RegisterProjectRequest })
    request: RegisterProjectRequest
  ) {
    const lang = request.lang;
    const _key = request.condition?._key;
    
    const aqlQuery = `
    FOR v IN biz_project
    filter v._key == "${_key}"
    RETURN v.skills
    `;
   const result =  await this.query(aqlQuery);
  
   const Skills = [];
   if (result.data[0]){
     for (const skill of result.data[0])
     {
       const skillName = await this.getNameOfSkill(skill, lang);
       const skills = {
         _key:skill,
         value:skillName.data[0]
       }
       Skills.push({skills})
     }
   }
   else {
    const skills = {
      _key:null,
      value:null
    }
    Skills.push({skills})
   }
   
    const response = new RegisterProjectResponse(
      200,
      Skills as RegisterProjectEntity[],
      ''
    );
    
    return response;
  }

  async getNameOfSkill(_key: string, lang: string) {
    const aqlQuery = `
     FOR v IN m_skill
     filter v._key == "${_key}"
     RETURN v.name.${lang}
     `;
    return await this.query(aqlQuery);
  }
  
}
