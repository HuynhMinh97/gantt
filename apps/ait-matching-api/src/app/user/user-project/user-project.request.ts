import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { UserProjectDto, SaveUserProjectDto } from './user-project.dto';


@InputType()
export class UserProjectRequest extends BaseRequest {
    @Field(() => UserProjectDto, { nullable: true })
    condition: UserProjectDto;

    @Field(() => [SaveUserProjectDto], { nullable: true })
    data: SaveUserProjectDto[];
}
