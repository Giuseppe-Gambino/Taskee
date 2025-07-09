import { TaskeeUser } from './../../interfaces/user';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-section-board',
  templateUrl: './header-section-board.component.html',
  styleUrl: './header-section-board.component.scss',
})
export class HeaderSectionBoardComponent {
  @Input() user!: TaskeeUser;
}
