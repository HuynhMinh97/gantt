import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ait-503',
  template: `
  <div class="container__503">
    <div style="display:flex;align-items:flex-end;margin-bottom:30px">
      <p class="message" (click)="navigateHome()">{{'家に帰ります' | translate}}</p>
      <div style="margin:10px"></div>
      <nb-icon
        icon="arrow-forward-outline"
        status="primary"
        style="font-size:50px;cursor:pointer"
        (click)="navigateHome()"
        ></nb-icon>
    </div>
  </div>
 `,
  styleUrls: ['./ait-503.component.scss']
})
export class Ait503Component {
  constructor(private router: Router) {

  }

  navigateHome = () => {
    this.router.navigate(['']);
  }

}
