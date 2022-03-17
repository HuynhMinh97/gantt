import { InputType, Field } from '@nestjs/graphql';
import { BinaryDataDto, BinaryDataSaveDto, BinaryRemoveDataDto } from '../dtos/binary-data.dto';
import { BaseRequest } from './base.request';

@InputType()
export class BinaryRequest extends BaseRequest {
  @Field(() => BinaryDataDto, { nullable: true })
  condition: BinaryDataDto;

  @Field(() => [BinaryDataDto], { nullable: true })
  data: BinaryDataDto[];
}


@InputType()
export class BinarySaveRequest extends BaseRequest {
  @Field(() => BinaryDataDto, { nullable: true })
  condition: BinaryDataDto;

  @Field(() => [BinaryDataSaveDto], { nullable: true })
  data: BinaryDataSaveDto[];
}

@InputType()
export class BinaryRemoveRequest extends BaseRequest {
  @Field(() => BinaryRemoveDataDto, { nullable: true })
  condition: BinaryRemoveDataDto;

  @Field(() => [BinaryRemoveDataDto], { nullable: true })
  data: BinaryRemoveDataDto[];
}
