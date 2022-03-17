import { Component } from '@angular/core';

@Component({
  selector: 'ait-checkbox-showcase',
  templateUrl: './checkbox.component.html',
})

export class CheckboxShowcaseComponent {

  checked = false;

  toggle(checked: boolean) {
    this.checked = checked;
  }
}