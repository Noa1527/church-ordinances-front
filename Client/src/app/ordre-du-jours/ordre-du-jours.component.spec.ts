import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdreDuJoursComponent } from './ordre-du-jours.component';

describe('OrdreDuJoursComponent', () => {
  let component: OrdreDuJoursComponent;
  let fixture: ComponentFixture<OrdreDuJoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdreDuJoursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdreDuJoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
