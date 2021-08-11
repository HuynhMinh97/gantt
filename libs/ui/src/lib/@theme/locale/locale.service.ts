import { Injectable, Optional, SkipSelf } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { noop } from 'rxjs';
import { AppState, getLang } from '../../state/selectors';

type ShouldReuseRoute = (future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot) => boolean;

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  private initialized = false;
  private _locale = 'ja-JP';

  get currentLocale(): string {
    return this._locale;
  }

  constructor(
    private router: Router,
    private store: Store<AppState>,
    @Optional()
    @SkipSelf()
    otherInstance: LocaleService,
  ) {
    if (otherInstance) throw 'LocaleService should have only one instance.';
  }

  private setRouteReuse(reuse: ShouldReuseRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = reuse;
  }

  private subscribeToLangChange() {
    this.store.pipe(select(getLang)).subscribe(async (lang) => {
      const lc = lang.replace('_', '-');
      if (this._locale !== lc) {
        const { shouldReuseRoute } = this.router.routeReuseStrategy;

        this.setRouteReuse(() => false);
        this.router.navigated = false;

        await this.router.navigateByUrl(this.router.url).catch(noop);
        this.setRouteReuse(shouldReuseRoute);
      }

    });
  }

  initLocale(localeId: string, defaultLocaleId = localeId) {
    if (this.initialized) return;

    this.setDefaultLocale(defaultLocaleId);
    this.setLocale(localeId);
    this.subscribeToLangChange();

    this.initialized = true;
    this.store.pipe(select(getLang)).subscribe(lang => {
      const lc = lang.replace('_', '-');
      if (this._locale !== lc) {
        this.setLocale(lc);
      }
    })
  }

  setDefaultLocale(localeId: string) {
    this._locale = localeId;
  }

  setLocale(localeId: string) {
    this._locale = localeId;
  }
}
