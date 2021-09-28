export interface UserSkill {
    _key: string;
    name: string;
    sort_no: number;
    top_skill: boolean;
    skill: string;
    category: {
        _key: string;
        value: string;
        parent_key?: string;
        code?: string;
      };
}

export interface OrderSkill {
    value: string;
    name: string;
    data: SkillsDto[];
}

export interface TopSkillDto {
    _key: string;
    name: string;
}
export class ButtonActionDto {
    title: string;
    style: string;
    action: any;
  }
export class SkillsDto {
    skill: string;
    _key: string;
    name: string;
    category: string;
    top_skill: boolean;
  }
  