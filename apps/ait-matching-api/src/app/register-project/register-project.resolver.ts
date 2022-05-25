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
    // const _key =  request.condition?._key;
    // const gql=`
    //   FOR data IN sys_caption
    //   FILTER data._key == "${_key}"
    //   return data
    // `;
    return await this.find(request);
    // const result = await this.find(request);
    // const userArr = [];
    // userArr.push({
    //   name:caption.data[0]?.name,
    //   module: caption.data[0]?.module,
    //   code: caption.data[0]?.code,
    //   page: caption.data[0]?.page,
    //   change_at: caption.data[0]?.change_at,
    //   change_by: result.data[0]?.change_by,
    //   create_at: caption.data[0]?.create_at,
    //   create_by: result.data[0]?.create_by,
    //   active_flag: result.data[0]?.active_flag,
    // });
    // const response = new CaptionResponse(
    //   200, 
    //   userArr as CaptionEntity[], 
    //   ''
    //   )
    // return response;
    
    // return this.query(gql);
  }
  @Mutation(() => RegisterProjectResponse, { name: 'saveCaption' })
  saveCaption(
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
      ;
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
