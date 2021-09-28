export interface UserSkill {
    _key: string;
    name: string;
    sort_no: number;
    top_skill: boolean;
    category: {
        _key: string;
        value: string;
        parent_key?: string;
        code?: string;
      };
}

export interface OrderSkill {
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
    top_skill: boolean;
    _key: string;
    name: string;
    category: string;
  }
  