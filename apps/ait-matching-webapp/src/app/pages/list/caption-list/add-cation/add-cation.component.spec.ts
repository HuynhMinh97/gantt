import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCationComponent } from './add-cation.component';

describe('AddCationComponent', () => {
  let component: AddCationComponent;
  let fixture: ComponentFixture<AddCationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
