import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElderSmsMailerComponent } from './elder-sms-mailer.component';

describe('ElderSmsMailerComponent', () => {
  let component: ElderSmsMailerComponent;
  let fixture: ComponentFixture<ElderSmsMailerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElderSmsMailerComponent]
    });
    fixture = TestBed.createComponent(ElderSmsMailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
