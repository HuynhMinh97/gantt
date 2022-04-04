/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Injectable, Type } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AitSettingsService {

  currentSettings: any;
  components: RouteComponents[] = []

  setInitialComponents = (routes: any[]) => {
    this.components = routes;
  }
}
export interface RouteComponents {
  component: Type<Component>;
  code: string;
  activeClass: any;
}
