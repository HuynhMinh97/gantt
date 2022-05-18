import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptionDetailComponent } from './caption-detail.component';

describe('CaptionDetailComponent', () => {
  let component: CaptionDetailComponent;
  let fixture: ComponentFixture<CaptionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptionDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
