import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardBoardHomeComponent } from './card-board-home/card-board-home.component';
import { FormsModule } from '@angular/forms';
import { TaskComponent } from './task/task.component';

@NgModule({
  declarations: [CardBoardHomeComponent, TaskComponent],
  imports: [CommonModule, FormsModule],
  exports: [CardBoardHomeComponent, TaskComponent],
})
export class SharedModule {}
