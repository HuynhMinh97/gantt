import { BaseDto } from "../base.dto";
import { KeyValueDto } from "../key-value.dto";

export interface CertificateInfoDto extends BaseDto {
  certificate_no1: string,
  japanese_skill: KeyValueDto,
  japanese_skill_certificate: string,
  qualification: string,
  qualification_certificate: string,
  user_id: string
}
