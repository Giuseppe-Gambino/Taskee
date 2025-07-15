import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Board } from '../../interfaces/board';

@Component({
  selector: 'app-header-board',
  templateUrl: './header-board.component.html',
  styleUrl: './header-board.component.scss',
})
export class HeaderBoardComponent {
  @Input() board!: Board;
  @Output() addList = new EventEmitter<void>();

  addNewList() {
    this.addList.emit();
  }
}
