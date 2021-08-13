import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ait-toc-menu',
  templateUrl: './ait-toc-menu.component.html',
  styleUrls: ['./ait-toc-menu.component.scss']
})
export class AitTocMenuComponent implements OnInit, AfterViewInit {
  @Input() items = [];
  isOpen = true;
  @Input() tabIndex;

  constructor(private router: Router, private _route: ActivatedRoute,) {

  }
  ngAfterViewInit() {
    const doc = document.getElementsByClassName('menu_toc_item');
    // const data = [].map.call(doc, d => {
    //   console.log(data)
    //   return d;
    // })

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

    // console.log(this.items)
  }
  ngOnInit(): void {
    const doc = document.getElementsByClassName('menu_toc_item');
  }

  goToElemet = (id: string) => {
    // this.router.navigate([this._route.url], {
    //   relativeTo: this._route,
    //   replaceUrl: true,
    //   fragment: decodeURIComponent(id),
    //   queryParamsHandling: 'merge',
    //   // preserve the existing query params in the route
    //   skipLocationChange: true
    // })
    const element = document.getElementById('menu_toc_item_' + id.trim());
    element.scrollIntoView({ behavior: 'smooth', inline: 'start' });
  }

  toggle = () => this.isOpen = !this.isOpen;

}
