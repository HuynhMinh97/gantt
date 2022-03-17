import { Inject, Injectable, InjectionToken } from '@angular/core';
export const Params = new InjectionToken<string[]>('ENVIRONMENT');

@Injectable({
  providedIn: 'root'
})
export class AitEnvironmentService {

}
