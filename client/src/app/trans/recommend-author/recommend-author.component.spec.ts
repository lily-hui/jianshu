import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendAuthorComponent } from './recommend-author.component';

describe('RecommendAuthorComponent', () => {
  let component: RecommendAuthorComponent;
  let fixture: ComponentFixture<RecommendAuthorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendAuthorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
