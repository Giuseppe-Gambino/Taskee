import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBoardHomeComponent } from './card-board-home.component';

describe('CardBoardHomeComponent', () => {
  let component: CardBoardHomeComponent;
  let fixture: ComponentFixture<CardBoardHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardBoardHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardBoardHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
