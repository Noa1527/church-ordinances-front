import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeuneGensComponent } from './jeune-gens.component';

describe('JeuneGensComponent', () => {
  let component: JeuneGensComponent;
  let fixture: ComponentFixture<JeuneGensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JeuneGensComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JeuneGensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
