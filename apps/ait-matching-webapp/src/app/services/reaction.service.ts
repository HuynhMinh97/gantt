import { AitBaseService } from '@ait/ui';
import { Injectable } from '@angular/core';


export interface Reaction {
  job_id?: string;
  user_id?: string;
}

export interface ReactionCompany {
  company_id?: string;
  user_key?: string;
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

  private urlReactionLoveJob = '/reaction/user-love-job';
  private urlReactionRemoveLoveJob = '/reaction/user-remove-love-job';
  private urlReactionViewJob = '/reaction/user-view-job';
  private urlReactionSaveJobUser = '/reaction/save-job-user';
  private urlReactionRemoveSaveJobUser = '/reaction/remove-save-job-user';
  private urlReactionLoveCompany = '/reaction/user-love-company';
  private urlReactionRemoveLoveCompany = '/reaction/user-remove-love-company';
  private urlReactionViewCompany = '/reaction/user-view-company';
  private urlReactionViewUser = '/reaction/user-view-user';
  private urlReactionCompanySaveUser = '/reaction/save-company-user';
  private urlReactionRemoveCompanySaveUser = '/reaction/remove-save-company-user';

  removeSaveCompanyUser = async (data: ReactionCompany[]) => {
    return await this.post(this.urlReactionRemoveCompanySaveUser, { data }).toPromise();
  }

  saveCompanyUser = async (data: ReactionCompany[]) => {
    return await this.post(this.urlReactionCompanySaveUser, { data }).toPromise();
  }

  userLoveCompany = async (data: ReactionCompany[]) => {
    return await this.post(this.urlReactionLoveCompany, { data }).toPromise();
  }
  removeUserLoveCompany = async (data: ReactionCompany[]) => {
    const result = await this.post(this.urlReactionRemoveLoveCompany, { data }).toPromise();
    return result;
  }

  userViewCompany = async (data: ReactionCompany[]) => {
    const result = await this.post(this.urlReactionViewCompany, { data }).toPromise();
    return result;
  }
  userViewUser = async (data: ReactionCompany[]) => {
    const result = await this.post(this.urlReactionViewUser, { data }).toPromise();
    return result;
  }

  userLoveJob = async (data: Reaction[]) => {
    const result = await this.post(this.urlReactionLoveJob, { data }).toPromise();
    return result;
  }

  userRemoveLoveJob = async (data: Reaction[]) => {
    const result = await this.post(this.urlReactionRemoveLoveJob, { data }).toPromise();
    return result;
  }

  userViewJob = async (data: Reaction[]) => {
    const result = await this.post(this.urlReactionViewJob, { data }).toPromise();
    return result;
  }

  saveJobUser = async (data: Reaction[], condition?: { collection_from?: string, collection_to?: string }) => {
    const result = await this.post(this.urlReactionSaveJobUser, { data, condition }).toPromise();
    return result;
  }

  removeSaveJobUser = async (data: Reaction[], condition?: { collection_from?: string, collection_to?: string }) => {
    const result = await this.post(this.urlReactionRemoveSaveJobUser, { data, condition }).toPromise();
    return result;
  }
}
