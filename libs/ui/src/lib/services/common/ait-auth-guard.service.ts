import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AitAppUtils } from '../../utils/ait-utils';
import { AitBaseService } from './ait-base.service';

@Injectable()
export class AitAuthGuardService implements CanActivate, CanActivateChild {

    constructor(
      private router: Router,
      private baseService : AitBaseService
    ) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
      // this.baseService.
      if (!AitAppUtils.isLogined()) {
        this.router.navigate(['/sign-in']);
        return false;
      }

      return true;
    }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.canActivate(route, state);
    }
}
