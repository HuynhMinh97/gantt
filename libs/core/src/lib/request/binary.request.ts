import { InputType, Field } from '@nestjs/graphql';
import { BinaryDataDto } from '../dtos/binary-data.dto';
import { BaseRequest } from './base.request';

@InputType()
export class BinaryRequest extends BaseRequest {
  @Field(() => BinaryDataDto, { nullable: true })
  condition: BinaryDataDto;

  @Field(() => [BinaryDataDto], { nullable: true })
  data: BinaryDataDto[];
}
