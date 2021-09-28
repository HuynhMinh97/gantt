import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSkillComponent } from './order-skill.component';

describe('OrderSkillComponent', () => {
  let component: OrderSkillComponent;
  let fixture: ComponentFixture<OrderSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderSkillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
