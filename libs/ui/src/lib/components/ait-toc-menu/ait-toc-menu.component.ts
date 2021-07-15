import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ait-toc-menu',
  templateUrl: './ait-toc-menu.component.html',
  styleUrls: ['./ait-toc-menu.component.scss']
})
export class AitTocMenuComponent implements OnInit, AfterViewInit {
  @Input() items = [];
  isOpen = true;

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
          title : m.innerHTML
        }
      })
    }

    console.log(this.items)
  }
  ngOnInit(): void {
    const doc = document.getElementsByClassName('menu_toc_item');
    // const data = [].map.call(doc, d => {
    //   console.log(data)
    //   return d;
    // })

    console.log(doc.length, doc, Array.from(doc))
  }

  goToElemet = (id) => {
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth', inline: 'start' });
  }

  toggle = () => this.isOpen = !this.isOpen;
}
