import { AitEnvironmentService, AitTranslationService, AppState, getCaption } from '@ait/ui';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'card-content',
  templateUrl: './card-content.component.html',
  styleUrls: ['./card-content.component.scss']
})
export class CardContentProfileComponent implements OnInit {

  constructor(private envService: AitEnvironmentService, private store: Store<AppState>, private translate: AitTranslationService) {
    store.pipe(select(getCaption)).subscribe(() => {
      this.buttonTitle = translate.translate(this.buttonTitle || '追加する');
    })
  }
  @Input() label = 'Default';
  @Input() sumDate = 'Default';
  @Input() loading = false;
  @Output() onClickButtonHeader = new EventEmitter();
  @Output() onToggle = new EventEmitter();
  @Input() isColumn = false;
  @Input() isStart = true;
  @Input() padding = '';
  @Input() tooltip = '';
  @Input() actionBtn = [];
  @Input() widthBtn = 'auto';
  @Input() content = '';
  @Input() styleLabel = {};
  @Input() styleContent = {};


  @Input() disableHeader = false;
  gradientString = 'linear-gradient(89.75deg, #002b6e 0.23%, #2288cc 99.81%)';
  isShow = true;
  @Input()
  isOpen = true;
  isDev = false;
  @Input()
  disableButton = false;
  @Input() buttonTitle = '';
  @Input() classContainer: any;
  @Input() id;
  @Input() idBtn = '';

  ID(element: string) {
    const idx = this.id && this.id !== '' ? this.id : Date.now();
    return idx + '_' + element;
  }

  get textButton(): string {
    return '追加する';
  }

  get LABEL(): string {
    return this.translate.translate(this.label);
  }
  get SUM(): string {
    return this.translate.translate(this.sumDate);
  }

  toggleExpan = (isClick = false) => {
    if (!isClick) {
      this.isOpen = !this.isOpen;
      this.onToggle.emit(this.isOpen);
    }
  };


  handleClickBtnHeader = (event) => {
    event.stopPropagation();
    !this.tooltip && this.onClickButtonHeader.emit({ clicked: true });
  }
  

  ngOnInit(): void {
  }

}
