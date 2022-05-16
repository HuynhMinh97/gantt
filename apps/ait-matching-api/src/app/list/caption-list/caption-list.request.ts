import { BaseRequest } from '@ait/core';
import { Field, InputType } from '@nestjs/graphql';
import { CaptionListDto, SearchCaptionListDto } from './caption-list.dto';

@InputType()
export class CaptionListRequest extends BaseRequest {
  @Field(() => CaptionListDto, { nullable: true })
  condition: CaptionListDto;
  @Field(() => [CaptionListDto], { nullable: true })
  data: CaptionListDto;
}

@InputType()
export class CaptionListSearchRequest extends BaseRequest{
    @Field(() => SearchCaptionListDto, { nullable: true })
    condition: SearchCaptionListDto;
}
