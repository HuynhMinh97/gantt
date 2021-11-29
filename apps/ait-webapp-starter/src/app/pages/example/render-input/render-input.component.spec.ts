import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderInputComponent } from './render-input.component';

describe('RenderInputComponent', () => {
  let component: RenderInputComponent;
  let fixture: ComponentFixture<RenderInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenderInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
