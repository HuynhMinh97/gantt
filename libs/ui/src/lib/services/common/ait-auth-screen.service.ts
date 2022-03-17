import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AitAppUtils } from '../../utils/ait-utils';

@Injectable()
export class AitAuthScreenService implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
  ) { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    if (AitAppUtils.isLogined() !== null && AitAppUtils.isLogined()) {
      this.router.navigate(['']);
      return false;
    }

    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
