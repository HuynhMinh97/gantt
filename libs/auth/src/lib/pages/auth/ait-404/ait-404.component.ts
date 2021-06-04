import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ait-404',
  template: `
  <div class="container__404">
    <h1>404 - NOT FOUND</h1>
    <div style="display:flex;">
      <nb-icon
        icon="home"
        status="primary"
        style="font-size:50px;cursor:pointer"
        (click)="navigateHome()"
        ></nb-icon>
      <div style="margin:10px"></div>
      <nb-icon
        icon="arrow-forward-outline"
        status="primary"
        style="font-size:50px;cursor:pointer"
        (click)="navigateHome()"
        ></nb-icon>
    </div>
  </div>`,
  styleUrls: ['./ait-404.component.scss']
})
export class Ait404Component {
  constructor(private router: Router) {

  }

  navigateHome = () => {
    this.router.navigate(['']);
  }
}
