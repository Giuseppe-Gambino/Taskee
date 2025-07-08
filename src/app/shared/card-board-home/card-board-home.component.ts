import { Component, Input, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-board-home',
  templateUrl: './card-board-home.component.html',
  styleUrl: './card-board-home.component.scss',
})
export class CardBoardHomeComponent {
  constructor(private route: Router) {}

  @Input() boardName!: string;
  @Input() boardID!: string;

  goToBoard() {
    if (!this.boardID) return;
    this.route.navigate(['/board', this.boardID]);
  }
}
