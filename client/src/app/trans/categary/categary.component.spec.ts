import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategaryComponent } from './categary.component';

describe('CategaryComponent', () => {
  let component: CategaryComponent;
  let fixture: ComponentFixture<CategaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
