// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries

import { BaseDto, NameDto } from '@ait/shared';

export interface ExampleRestDto extends BaseDto {
  class: string;
  parent_code: string;
  code: string;
  name: NameDto;
}
