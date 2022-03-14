import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { ProjectListDto, SearchProjectDto } from './project-list.dto';

@InputType()
export class ProjectListRequest extends BaseRequest {
    @Field(() => SearchProjectDto, { nullable: true })
    condition: SearchProjectDto;

    @Field(() => [ProjectListDto], { nullable: true })
    data: ProjectListDto[];
}


