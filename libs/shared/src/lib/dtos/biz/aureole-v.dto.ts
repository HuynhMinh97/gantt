import { BaseDto } from "@ait/shared";


// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConfigHistory extends BaseDto {
  url?: string;
  X_API_Key?: string;
  database?: string;
  status?: string;
  count?: number;
}


export interface ConfigPE {
  name?: string;
  api_url?: string;
  http_method?: string;
  api_key?: string;
  params?: {
    system?: string;
    database?: string;
  };
  sort_no?: number;
}
