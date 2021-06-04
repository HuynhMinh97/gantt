import { Injectable, } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AitEnvironmentService {
  public env
  /**
   *
   */

  setEnv = (env) => {
    this.env = env;
  }

  getEnv = () => {
    return this.env;
  };
}
