import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSectionBoardComponent } from './header-section-board.component';

describe('HeaderSectionBoardComponent', () => {
  let component: HeaderSectionBoardComponent;
  let fixture: ComponentFixture<HeaderSectionBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderSectionBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderSectionBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
