/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { COLLECTIONS, GRAPHQL, isObjectFull } from '@ait/shared';
import { Injectable } from '@angular/core';
import { AitBaseService } from './ait-base.service';

@Injectable({
  providedIn: 'root',
})
export class AitRenderPageService extends AitBaseService {
  getKey = {
    _key: true,
    code: true
  };

  getPage = {
    _key: true,
    code: true,
    name: true,
    router: {
      search: true,
      input: true,
      view: true
    },
    button: {
      type: true,
      text: true,
      icon: true,
      tooltip: true
    },
    allow_new: true
  }

  searchField = {
    item_no: true,
    row_no: true,
    col_no: true,
    item_id: true,
    item_label: true,
    item_placeholder: true,
    type: true,
    component_setting: {
      collection: true,
      max_item: true,
      max_file: true,
      width: true,
      required: true,
      from_to: true,
      is_multi_language: true,
      class: true,
      title: true,
      rows: true,
      allow_new: true,
      allow_delete: true,
      has_status: true,
      guidance_icon: true,
      guidance: true,
      margin: true,
      file_type: true,
      data_source: {
        _key: true,
        value: true
      }
    },
    search_setting: {
      operator: true,
      type: true,
      attribute: true,
      ref_collection: true,
      ref_attribute: true,
      get_by: true
    }
  };

  searchResult = {
    item_id: true,
    collection: true,
    name: true,
    settings: {
      no_data_message: true,
      filter_message: true,
      select_mode: true,
      paper: {
        display: true,
        per_page: true,
      },
    },
    actions: {
      view: true,
      copy: true,
      edit: true,
      delete: true,
    },
    columns: {
      name: true,
      title: true,
      type: true,
      attribute: true,
      ref_collection: true,
      ref_attribute: true,
      is_multi_language: true,
      style: {
        width: true,
      },
    },
  };

  async findModule(condition?: any, rf?: any) {
    const returnFields = rf ? rf : this.getKey;
    const request = {};
    request['collection'] = COLLECTIONS.MODULE;
    if (isObjectFull(condition)) {
      request['condition'] = condition;
    }
    return await this.query(GRAPHQL.FIND_MODULE, request, returnFields);
  }

  async findGroup(condition?: any, rf?: any) {
    const returnFields = rf ? rf : { _key: true, code: true, type: true, name: true, collection: true };
    const request = {};
    request['collection'] = COLLECTIONS.GROUP;
    if (isObjectFull(condition)) {
      request['condition'] = condition;
    }
    return await this.query(GRAPHQL.FIND_GROUP, request, returnFields);
  }

  async findPage(condition?: any, rf?: any) {
    const returnFields = rf ? rf : this.getPage;
    const request = {};
    request['collection'] = COLLECTIONS.PAGE;
    if (isObjectFull(condition)) {
      request['condition'] = condition;
    }
    return await this.query(GRAPHQL.FIND_PAGE, request, returnFields);
  }

  async findSearchCondition(condition?: any, rf?: any) {
    const returnFields = rf ? rf : this.searchField;
    const request = {};
    request['collection'] = COLLECTIONS.SEARCH_CONDITIONS;
    if (isObjectFull(condition)) {
      request['condition'] = condition;
    }
    request['options'] = {
      sort_by: {
        value: 'col_no',
      },
    };
    return await this.query(
      GRAPHQL.FIND_SEARCH_CONDITIONS,
      request,
      returnFields
    );
  }

  async findSysInput(condition?: any, rf?: any) {
    const returnFields = rf ? rf : this.searchField;
    const request = {};
    request['collection'] = COLLECTIONS.SYS_INPUT;
    if (isObjectFull(condition)) {
      request['condition'] = condition;
    }
    request['options'] = {
      sort_by: {
        value: 'col_no',
      },
    };
    return await this.query(GRAPHQL.FIND_SYS_INPUT, request, returnFields);
  }

  async findSysView(condition?: any, rf?: any) {
    const returnFields = rf ? rf : this.searchField;
    const request = {};
    request['collection'] = COLLECTIONS.SYS_VIEW;
    if (isObjectFull(condition)) {
      request['condition'] = condition;
    }
    request['options'] = {
      sort_by: {
        value: 'col_no',
      },
    };
    return await this.query(GRAPHQL.FIND_SYS_VIEW, request, returnFields);
  }

  async findSearchResult(condition?: any, rf?: any) {
    const returnFields = rf ? rf : this.searchResult;
    const request = {};
    request['collection'] = COLLECTIONS.SEARCH_RESULT;
    if (isObjectFull(condition)) {
      request['condition'] = condition;
    }
    return await this.query(GRAPHQL.FIND_SEARCH_RESULT, request, returnFields);
  }

  async findDataByCollection(collection: string, condition?: any) {
    const returnFields = { data: true };
    const request = {
      collection,
      condition
    };
    return await this.query(
      GRAPHQL.FIND_DATA_BY_COLLECTION,
      request,
      returnFields
    );
  }

  async findAllDataByCollection(collection: string, condition?: any) {
    const returnFields = { data: true };
    const request = {
      collection,
      condition
    };
    return await this.query(
      GRAPHQL.FIND_ALL_DATA_BY_COLLECTION,
      request,
      returnFields
    );
  }

  async saveRenderData(collection: string, data: any[], rf?: any) {
    const returnFields = rf ? rf : { _key: true, data: true };
    return await this.mutation(
      GRAPHQL.SAVE_DATA_RENDER,
      collection,
      data,
      returnFields
    );
  }

  async remove(collection: string, _key: string) {
    const data = { _key };
    return await this.mutation('removeSystem', collection, [data], { _key: true });
  }
}
