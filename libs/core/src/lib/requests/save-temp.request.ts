import { InputType, Field } from '@nestjs/graphql';
import { SaveTempDto } from '../dtos/save-temp.dto';
import { BaseRequest } from './base.request';

@InputType()
export class SaveTempRequest extends BaseRequest {
  @Field(() => SaveTempDto, { nullable: true })
  condition: SaveTempDto;

  @Field(() => [SaveTempDto], { nullable: true })
  data: SaveTempDto[];
}
