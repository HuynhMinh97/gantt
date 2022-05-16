import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptionListComponent } from './caption-list.component';

describe('CaptionListComponent', () => {
  let component: CaptionListComponent;
  let fixture: ComponentFixture<CaptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
