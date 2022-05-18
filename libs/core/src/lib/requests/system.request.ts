import { Field, InputType } from '@nestjs/graphql';
import { SystemDto, SystemMasterDto } from '../dtos/system.dto';
import { UpdateSystemDto } from '../dtos/update-system.dto';
import { BaseRequest } from './base.request';

@InputType()
export class SystemRequest extends BaseRequest {
  @Field(() => SystemDto, { nullable: true })
  condition: SystemDto;

  @Field(() => [UpdateSystemDto], { nullable: true })
  data: UpdateSystemDto[];
}
@InputType()
export class SystemMasterRequest extends BaseRequest {
  @Field(() => SystemMasterDto, { nullable: true })
  condition: SystemMasterDto;

  @Field(() => [UpdateSystemDto], { nullable: true })
  data: UpdateSystemDto[];
}