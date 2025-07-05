import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-card-board-home',
  templateUrl: './card-board-home.component.html',
  styleUrl: './card-board-home.component.scss',
})
export class CardBoardHomeComponent {
  @Input() boardName!: string;
}
