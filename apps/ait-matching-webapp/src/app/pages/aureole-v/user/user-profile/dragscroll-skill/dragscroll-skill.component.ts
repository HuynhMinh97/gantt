import { EventEmitter, Output } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ait-dragscroll-skill',
  styleUrls: ['./dragscroll-skill.component.scss',],
  template: `
   <drag-scroll [scrollbar-hidden]="true" *ngIf="skillList.length !== 0 && !isNormal"
   [ngStyle]="{
     'max-width' : maxWidth || null,
     'min-width' : minWidth || null,
     'width' : width || null
   }"
   >
    <button
      nbButton
      shape="round"
      size="small"
      status="primary"
      class="items"
      style="
        background-color: #ffffff;
        color: #10529d;
        margin: 4px;
        border: 0.6px solid #e0eeff;
        height: 25px;
        outline: none;
        cursor: grab;
      "
      *ngFor="let skill of skillList"
      [ngStyle]="{ background: skill.isHightLight ? '#e0eeff' : '#fff' }"
    >
      <span
        style="
          text-transform: initial;
          font-weight: 600;
          font-size: 13px;
          color: #10529d;
        "
        >{{ skill}}</span
      >

      <!-- {{skillList | json}} -->
    </button>
  </drag-scroll>
  <div *ngIf="isNormal" class="normal">
  <button
      nbButton
      shape="round"
      size="small"
      status="primary"
      class="items"
      style="
        background-color: #ffffff;
        color: #10529d;
        margin: 4px;
        border: 0.6px solid #e0eeff;
        height: 25px;
        outline: none;
        cursor: grab;
      "
      *ngFor="let skill of skillList"
      [ngStyle]="{ background: skill.isHightLight ? '#e0eeff' : '#fff' }"
    >
      <span
        style="
          text-transform: initial;
          font-weight: 600;
          font-size: 13px;
          color: #10529d;
        "
        >{{ skill }}</span
      >

      <!-- {{skillList | json}} -->
    </button>
  </div>
  <p *ngIf="skillList.length === 0">List skill empty</p>
  `,
})
export class DragScrollSkillComponent {
  @Input() skillList: any[];
  @Input() showField: string;
  @Input() maxWidth: string;
  @Input() minWidth: string;
  @Input() width: string;
  @Input() isNormal: boolean = false;
}
