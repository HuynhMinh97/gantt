import { AitBaseService, AitCtxUser, KeyValueDto, SysUser } from '@ait/core';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CourseRequest } from './user_course.request';
import { CourseResponse } from './user_course.response';


@Resolver()
export class CourseResolver extends AitBaseService {
  collection = 'Course';

  @Query(() => CourseResponse, { name: 'findCourse' })
  async findCourse(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => CourseRequest }) request: CourseRequest) {         
    return this.find(request, user);
  }

  @Mutation(() => CourseResponse, { name: 'saveCourse' })
  saveCourse(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => CourseRequest }) request: CourseRequest
  ) {
    
    return this.save(request, user);
  }

  @Mutation(() => CourseResponse, { name: 'removeCourse' })
  removeCourse(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => CourseRequest }) request: CourseRequest
  ) {
    return this.remove(request, user);
  }
}