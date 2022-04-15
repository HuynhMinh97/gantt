import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { CertificateListDto, CertificateSearchDto } from './certificate-list.dto';

@InputType()
export class CertificateListRequest extends BaseRequest {
    @Field(() => CertificateSearchDto, { nullable: true })
    condition: CertificateSearchDto;

    @Field(() => [CertificateListDto], { nullable: true })
    data: CertificateListDto[];
}

