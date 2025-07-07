import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTicketComponentComponent } from './create-ticket-component.component';

describe('CreateTicketComponentComponent', () => {
  let component: CreateTicketComponentComponent;
  let fixture: ComponentFixture<CreateTicketComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateTicketComponentComponent]
    });
    fixture = TestBed.createComponent(CreateTicketComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
