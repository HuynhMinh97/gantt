import { BaseRequest } from "@ait/core";
import { Field, InputType } from "@nestjs/graphql";
import { DataMasterDto } from "./edit-data-master.dto";
@InputType()
export class DataMasterRequest extends BaseRequest {
  @Field(() => DataMasterDto, { nullable: true })
  condition: DataMasterDto;
  @Field(() => [DataMasterDto], { nullable: true })
  data: DataMasterDto;
}