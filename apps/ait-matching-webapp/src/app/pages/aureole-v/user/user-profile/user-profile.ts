export interface OrderSkill {
    name: string;
    data: string[];
}
export class KeyValueDto {
    _key: string;
    value: string;
}
export interface ProfileDto {
    user_id: string,
    avatar_url:string,
    background_url: string,
    last_name: string,
    first_name: string,
    title: KeyValueDto,
    company_working: KeyValueDto,
    province_city: KeyValueDto,
    country_region: KeyValueDto,
    about: string,
    top_skills: KeyValueDto[];
}
export interface CertificateDto {
    name: string,
    issue_by: string,
    issue_date_from:string,
    issue_date_to: string,
    _key: string,
}

export interface CourseDto {
    name: string,
    training_center: string,
    start_date_from:string,
    start_date_to: string,
    _key: string,
}
export interface EducationDto {
    school: string,
    field_of_study: string,
    start_date_from:string,
    start_date_to: string,
    _key: string,
}
export interface LanguageDto {
    language: string,
    proficiency: string,
    _key: string,
    image: string
}