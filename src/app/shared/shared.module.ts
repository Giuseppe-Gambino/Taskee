import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardBoardHomeComponent } from './card-board-home/card-board-home.component';
import { FormsModule } from '@angular/forms';
import { TaskComponent } from './task/task.component';
import { HeaderSectionBoardComponent } from './header-section-board/header-section-board.component';
import { HeaderBoardComponent } from './header-board/header-board.component';

@NgModule({
  declarations: [
    CardBoardHomeComponent,
    TaskComponent,
    HeaderSectionBoardComponent,
    HeaderBoardComponent,
  ],
  imports: [CommonModule, FormsModule],
  exports: [
    CardBoardHomeComponent,
    TaskComponent,
    HeaderSectionBoardComponent,
    HeaderBoardComponent,
  ],
})
export class SharedModule {}
