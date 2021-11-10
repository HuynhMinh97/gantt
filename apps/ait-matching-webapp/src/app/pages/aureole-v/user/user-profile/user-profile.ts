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
    city: KeyValueDto,
    country: KeyValueDto,
    about: string,
    top_skills: KeyValueDto[];
}
//project
export interface GroupProjectDto {
    company_name: string,
    floor_building:"Ho Chi Minh City, Vietnam",
    street:string,
    working_time:string,
    date: number,
    data: ProjectDto[],
}
export interface ProjectDto {
    is_working: boolean,
    name:string,
    start_date_from:string,
    start_date_to:string,
    isEdited:boolean,
    title:string,
    time: string,
    _key:string,
}
export interface GroupExperienceDto {
    company_working: string,
    floor_building:"Ho Chi Minh City, Vietnam",
    working_time:string,
    date: number,
    data: ExperienDto[],
}
export interface ExperienDto {
    title:string,
    employee_type:string,
    is_working: boolean,
    start_date_from:string,
    start_date_to:string,
    isEdited:boolean,
    time: string,
    _key:string,
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