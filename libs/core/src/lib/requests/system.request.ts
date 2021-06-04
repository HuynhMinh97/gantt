import { LangDto } from '@ait/core';
import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { SystemDto } from '../dtos/system.dto';
import { BaseRequest } from './base.request';

@InputType()
export class SystemRequest extends BaseRequest {
  @Field(() => SystemDto, { nullable: true })
  condition: SystemDto;

  @Field(() => [UpdateSystemDto], { nullable: true })
  data: UpdateSystemDto[];
}
@InputType()
export class UpdateSystemDto extends PartialType(
  OmitType(SystemDto, ['name'] as const),
) {
  @Field(() => LangDto, { nullable: true })
  name: LangDto;
}