import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardBoardHomeComponent } from './card-board-home/card-board-home.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CardBoardHomeComponent],
  imports: [CommonModule, FormsModule],
  exports: [CardBoardHomeComponent],
})
export class SharedModule {}
