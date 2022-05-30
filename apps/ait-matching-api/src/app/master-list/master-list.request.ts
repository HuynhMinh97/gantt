import { BaseRequest } from "@ait/core";
import { Field, InputType } from "@nestjs/graphql";
import { MasterListDto, SearchMasterListDto } from "./master-list.dto";

@InputType()
export class MasterListRequest extends BaseRequest {
  @Field(() => SearchMasterListDto, { nullable: true })
  condition: SearchMasterListDto;
  @Field(() => [MasterListDto], { nullable: true })
  data: MasterListDto;
}