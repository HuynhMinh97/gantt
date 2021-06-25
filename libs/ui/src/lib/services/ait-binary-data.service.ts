import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../state/selectors';
import { AitBaseService } from './common/ait-base.service';
import { AitEnvironmentService } from './ait-environment.service';
import { Apollo } from 'apollo-angular';

@Injectable({ providedIn: 'root' })
export class AitBinaryDataService extends AitBaseService {
  private getFile = this.env?.API_PATH?.SYS?.BINARY_DATA + '/get';
  public downloadUrl = this.env?.API_PATH?.BASE_PREFIX + this.env?.API_PATH?.SYS?.BINARY_DATA + '/get-file' + '?_key=';
  constructor(http: HttpClient, store: Store<AppState>,
    envService: AitEnvironmentService,
    apollo: Apollo
  ) {
    super(envService, store, http, null, apollo);
  }

  async getFilesByFileKeys(file_key: string | string[]) {

    if ((file_key || []).length !== 0) {
      try {
        const req = {
          collection: 'sys_binary_data',
          condition: {
            _key: {
              value: file_key
            }
          }
        }
        const result = await this.query('findBinaryData', req, {
          _key: true,
          data_base64: true,
          file_type: true,
          size: true,
          name: true,
        });
        console.log(file_key, req)
        return result;
      } catch (error) {
        console.log(error);
        return null;
      }
    }
    return null;
  }

  async getFilesByKeys(_keys: string | string[]) {
    if ((_keys || '').length !== 0) {
      return await this.post(this.getFile, {
        condition: {
          _key: _keys
        }
      }).toPromise();
    }
    return null;
  }

  downloadFile = async (file_key: string) => {
    return await this.http.get('/api/v1/sys-binary-data/get-file' + '?_key=' + file_key).toPromise();
  }

}
