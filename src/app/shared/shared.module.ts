import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardBoardHomeComponent } from './card-board-home/card-board-home.component';

@NgModule({
  declarations: [CardBoardHomeComponent],
  imports: [CommonModule],
  exports: [CardBoardHomeComponent],
})
export class SharedModule {}
