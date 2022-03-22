import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


export interface Reaction {
  job_id?: string;
  user_id?: string;
}

export interface ReactionCompany {
  company_id?: string;
  user_key?: string;
  save_key? : string
}

export interface ReactionUserJob{
  job_id?: string;
  user_key?: string;
  save_key? : string
}

export interface ReactionUser {
  user_key?: string;
}


export interface ReactionLove {
  user_key_from: string;
  user_key_to: string;
}

export interface ReactionLoveCompany {
  user_key_from: string;
  company_key: string;
}

@Injectable()
export class ReactionService extends AitBaseService {


  private urlReactionCompanySaveUser = environment.API_PATH.AUREOLEV.RECOMMENCED_USER.SAVE_COMPANY_USER;
  private urlReactionRemoveCompanySaveUser = environment.API_PATH.AUREOLEV.RECOMMENCED_USER.REMOVE_SAVE_COMPANY_USER;

  private urlReactionJobSaveUser = environment.API_PATH.AUREOLEV.RECOMMENCED_JOB.SAVE_USER_JOB;
  private urlReactionRemoveJobSaveUser = environment.API_PATH.AUREOLEV.RECOMMENCED_JOB.REMOVE_SAVE_USER_JOB;


  removeSaveCompanyUser = async (data: ReactionCompany[]) => {
    return await this.post(this.urlReactionRemoveCompanySaveUser, { data }).toPromise();
  }

  removeSaveUserJob = async (data: ReactionUserJob[]) => {
    return await this.post(this.urlReactionRemoveJobSaveUser, { data }).toPromise();
  }

  saveCompanyUser = async (data: ReactionCompany[]) => {
    return await this.post(this.urlReactionCompanySaveUser, { data }).toPromise();
  }

  saveUserJob = async (data: ReactionUserJob[]) => {
    return await this.post(this.urlReactionJobSaveUser, { data }).toPromise();
  }


}
