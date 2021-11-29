/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, InputType } from '@nestjs/graphql';
import {
  SaveDataDto,
  SysGroupDto,
  SysInputDto,
  SysModuleDto,
  SysPageDto,
  SysSearchConditionDto,
  SysSearchResultDto,
} from '../dtos/page-render.dto';
import { BaseRequest } from './base.request';
import { GraphQLJSONObject } from 'graphql-type-json';

@InputType()
export class SysGroupRequest extends BaseRequest {
  @Field(() => SysGroupDto, { nullable: true })
  condition: SysGroupDto;
}

@InputType()
export class SysModuleRequest extends BaseRequest {
  @Field(() => SysModuleDto, { nullable: true })
  condition: SysModuleDto;
}

@InputType()
export class SysPageRequest extends BaseRequest {
  @Field(() => SysPageDto, { nullable: true })
  condition: SysPageDto;
}

@InputType()
export class SysSearchConditionRequest extends BaseRequest {
  @Field(() => SysSearchConditionDto, { nullable: true })
  condition: SysSearchConditionDto;
}

@InputType()
export class SysSearchResultRequest extends BaseRequest {
  @Field(() => SysSearchResultDto, { nullable: true })
  condition: SysSearchResultDto;
}

@InputType()
export class SysInputRequest extends BaseRequest {
  @Field(() => SysInputDto, { nullable: true })
  condition: SysInputDto;
}

@InputType()
export class SaveDataRequest extends BaseRequest {
  @Field(() => [GraphQLJSONObject], { nullable: true })
  data: any[];
}
