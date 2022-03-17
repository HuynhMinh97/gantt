export interface PwdChangeInput {
    user: any;
}

export interface JwtPayload {
    user_key?: string,
    company?: string;
    lang?: string;
    user_code?: string;
}

export interface ListPath {
    empId: string;
    typeNum?: number;
}
