export interface OrderSkill {
    name: string;
    data: SkillsDto[];
}
export class SkillsDto {
    _key: string;
    value: string;
    category: string;
}
export class TopSkill{
    _key: string;
    value: string;
}
export interface ProfileDto {
    avatar_url:string,
    background_url: string,
    last_name: string,
    first_name: string,
    title: string,
    company_working: string,
    province_city: string,
    country: string,
    introduce: string,
    top_skills: SkillsDto[];
}