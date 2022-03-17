import { AfterViewInit, Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ait-toc-menu',
  templateUrl: './ait-toc-menu.component.html',
  styleUrls: ['./ait-toc-menu.component.scss']
})
export class AitTocMenuComponent implements AfterViewInit {
  @Input() items = [];
  isOpen = true;
  @Input() tabIndex;
  item_ids = [];
  @Input() id;

  constructor(private router: Router, private _route: ActivatedRoute,) {
  }


  ngAfterViewInit() {
    setTimeout(() => {
      const doc = document.getElementsByClassName(this.id + '_menu_toc_item');
      if (this.items.length === 0) {
        this.items = Array.from(doc).map((m) => {
          return {
            id: m.id,
            title: m.innerHTML
          }
        });
        const ids = Array.from(new Set(this.items.map(x => x?.title)));
        this.items = ids.map(x => {
          const it = this.items.find(d => d.title === x);
          return it
        });
      }
    }, 1000);
    
  }

  goToElemet = (id: string) => {
    const element = document.getElementById(this.id + '_menu_toc_item_' + id.trim());
    element.scrollIntoView({ behavior: 'smooth', inline: 'start' });
  }

  toggle = () => this.isOpen = !this.isOpen;

}
