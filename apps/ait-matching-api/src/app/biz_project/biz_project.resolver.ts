import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetProjectInforEntity } from './biz_project.entity';
import { BizProjectRequest, GetBizProjectInfoRequest } from './biz_project.request';
import { BizProjectResponse, GetBizProjectInforResponse } from './biz_project.response';

@Resolver()
export class BizProjectResolver extends AitBaseService {
  @Mutation(() => BizProjectResponse, { name: 'saveBizProject' })
  saveBizProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectRequest })
    request: BizProjectRequest
  ) {
    return this.save(request, user);
  }

  @Query(() => BizProjectResponse, { name: 'findProjectAitByKey' })
  async findProjectAitByKey(
    @Args('request', { type: () => GetBizProjectInfoRequest })
    request: GetBizProjectInfoRequest
  ) {
    return await this.find(request);
  }

  @Query(() => GetBizProjectInforResponse, { name: 'findSkillProject' })
  async findSkillProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => GetBizProjectInfoRequest })
    request: GetBizProjectInfoRequest
  ) {
    const lang = request.lang;
    const _key = request.condition?._key;
    const collection = request.collection
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
       const skillName = await this.getNameByKey(skill, lang, collection);
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
   
    const response = new GetBizProjectInforResponse(
      200,
      Skills as GetProjectInforEntity[],
      ''
    );
    
    return response;
  }

  @Query(() => GetBizProjectInforResponse, { name: 'findTitleProject' })
  async findTitleProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectRequest })
    request: BizProjectRequest
  ) {
    const lang = request.lang;
    const _key = request.condition?._key;
    const collection = request.collection
    
    const aqlQuery = `
    FOR v IN biz_project
    filter v._key == "${_key}"
    RETURN v.title
    `;
   const result =  await this.query(aqlQuery);
  
   const Titles = [];
   
   if (result.data[0]){
     for (const item of result.data[0])
     {
       const titleName = await this.getNameByKey(item, lang, collection);
       const title = {
         _key:item,
         value:titleName.data[0]
       }
       Titles.push({title})
     }
   }
   else {
    const titles = {
      _key:null,
      value:null
    }
    Titles.push({titles})
   }
   
    const response = new GetBizProjectInforResponse(
      200,
      Titles as GetProjectInforEntity[],
      ''
    );
    
    return response;
  }

  @Query(() => GetBizProjectInforResponse, { name: 'findIndustryProject' })
  async findIndustryProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectRequest })
    request: BizProjectRequest
  ) {
    const lang = request.lang;
    const _key = request.condition?._key;
    const collection = request.collection
    
    const aqlQuery = `
    FOR v IN biz_project
    filter v._key == "${_key}"
    RETURN v.industry
    `;
   const result =  await this.query(aqlQuery);
  
   const Industry = [];
   
   if (result.data[0]){
     for (const item of result.data[0])
     {
       const Name = await this.getNameByKey(item, lang, collection);
       const industry = {
         _key:item,
         value:Name.data[0]
       }
       Industry.push({industry})
     }
   }
   else {
    const industry = {
      _key:null,
      value:null
    }
    Industry.push({industry})
   }
   
    const response = new GetBizProjectInforResponse(
      200,
      Industry as GetProjectInforEntity[],
      ''
    );
    
    return response;
  }

  @Query(() => GetBizProjectInforResponse, { name: 'findLevelProject' })
  async findLevelProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectRequest })
    request: BizProjectRequest
  ) {
    const lang = request.lang;
    const _key = request.condition?._key;
    const collection = request.collection
    
    const aqlQuery = `
    FOR v IN biz_project
    filter v._key == "${_key}"
    RETURN v.level
    `;
   const result =  await this.query(aqlQuery);
  
   const Level = [];
   
   if (result.data[0]){
     for (const item of result.data[0])
     {
       const Name = await this.getNameByKey(item, lang, collection);
       const level = {
         _key:item,
         value:Name.data[0]
       }
       Level.push({level})
     }
   }
   else {
    const level = {
      _key:null,
      value:null
    }
    Level.push({level})
   }
   
    const response = new GetBizProjectInforResponse(
      200,
      Level as GetProjectInforEntity[],
      ''
    );
    
    return response;
  }

  @Query(() => GetBizProjectInforResponse, { name: 'findLocationProject' })
  async findLocationProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectRequest })
    request: BizProjectRequest
  ) {
    const lang = request.lang;
    const _key = request.condition?._key;
    const collection = request.collection
    
    const aqlQuery = `
    FOR v IN biz_project
    filter v._key == "${_key}"
    RETURN v.location
    `;
   const result =  await this.query(aqlQuery);
  
   const Location = [];
   
   if (result.data[0]){
     for (const item of result.data[0])
     {
       const Name = await this.getNameByKey(item, lang, collection);
       const location = {
         _key:item,
         value:Name.data[0]
       }
       Location.push({location})
     }
   }
   else {
    const location = {
      _key:null,
      value:null
    }
    Location.push({location})
   }
   
    const response = new GetBizProjectInforResponse(
      200,
      Location as GetProjectInforEntity[],
      ''
    );
    
    return response;
  }

  async getNameByKey(_key: string, lang: string, collection: string) {
    const aqlQuery = `
     FOR v IN ${collection}
     filter v._key == "${_key}"
     RETURN v.name.${lang}
     `;
     
    return await this.query(aqlQuery);
  }

 

}
