import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcrenComponent } from './concren.component';

describe('ConcrenComponent', () => {
  let component: ConcrenComponent;
  let fixture: ComponentFixture<ConcrenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcrenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
