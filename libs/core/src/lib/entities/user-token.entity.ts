import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserToken {
    @Field(() => String)
    token: string;

    @Field(() => String)
    refreshToken: string;

    @Field(() => String)
    timeLog: string;
}
