import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { UserCertificateDto } from './user_certificate.dto';

@InputType()
export class UserCertificateRequest extends BaseRequest {
  @Field(() => UserCertificateDto, { nullable: true })
  condition: UserCertificateDto;

  @Field(() => [UserCertificateDto], { nullable: true })
  data: UserCertificateDto;
}