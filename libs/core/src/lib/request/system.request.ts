import { Field, InputType } from '@nestjs/graphql';
import { SystemDto } from '../dtos/system.dto';
import { BaseRequest } from './base.request';

@InputType()
export class SystemRequest extends BaseRequest {
  @Field(() => SystemDto, { nullable: true })
  condition: SystemDto;

  @Field(() => [SystemDto], { nullable: true })
  data: SystemDto[];
}
