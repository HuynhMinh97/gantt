export class RequestModel<T> {
  company: string;
  lang: string;
  module: string;
  page: string;
  token: string;
  user_id: string;
  condition?: T;
  data?: T[];
}

export interface RequestCoreMatching {
  code: string,
  bind_vars: {
    company_key?: string;
    input_users?: any,
    input_company?: any
  }
}

export class RequestCoreModel {
  company: string;
  lang: string;
  user_id: string;
  collection: string;
  start_vertex: unknown;
  direction?: unknown;
  condition?: unknown;
  select_field?: unknown;
  data?: unknown;
  sort?: unknown;
  _key?: string;
  limit: number;
  view: string;
  name?: any;

  constructor(collection: string) {
    this.collection = collection;
  }
}
