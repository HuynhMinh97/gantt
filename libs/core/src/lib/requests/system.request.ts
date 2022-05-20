import { Field, InputType } from '@nestjs/graphql';
import {
  SystemDto,
  SystemAllLangDto,
  SystemMasterDto,
} from '../dtos/system.dto';
import {
  UpdateSystemDto,
  UpdateSystemAllLangDto,
} from '../dtos/update-system.dto';
import { BaseRequest } from './base.request';

@InputType()
export class SystemRequest extends BaseRequest {
  @Field(() => SystemDto, { nullable: true })
  condition: SystemDto;

  @Field(() => [UpdateSystemDto], { nullable: true })
  data: UpdateSystemDto[];
}

@InputType()
export class SystemAllLangRequest extends BaseRequest {
  @Field(() => SystemAllLangDto, { nullable: true })
  condition: SystemAllLangDto;

  @Field(() => [UpdateSystemAllLangDto], { nullable: true })
  data: UpdateSystemAllLangDto[];
}

@InputType()
export class SystemMasterRequest extends BaseRequest {
  @Field(() => SystemMasterDto, { nullable: true })
  condition: SystemMasterDto;

  @Field(() => [UpdateSystemDto], { nullable: true })
  data: UpdateSystemDto[];
}
