import {
  Component,
  EventEmitter,
  Input,
  input,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { BoardDTO } from '../../interfaces/board';
import { TaskeeUser } from '../../interfaces/user';

@Component({
  selector: 'app-card-board-home',
  templateUrl: './card-board-home.component.html',
  styleUrl: './card-board-home.component.scss',
})
export class CardBoardHomeComponent implements OnInit {
  constructor(private route: Router, private firestore: FirestoreService) {}

  ngOnInit(): void {
    this.colorBoard = this.board.color;
    this.nameBoard = this.board.name;
  }

  @Input() board!: BoardDTO;
  @Input() user!: TaskeeUser;

  goToBoard() {
    if (!this.board.id) return;
    this.route.navigate(['/board', this.board.id]);
  }

  deleteBoard() {
    this.firestore.deleteBoard(this.user.id, this.board.id, this.user);
    this.delete.emit();
  }

  @Output() delete = new EventEmitter<void>();

  nameBoard: string | null = null;
  colorBoard: string = '';

  editBoard() {
    if (!this.nameBoard) return;
    const id = this.board.id;
    const newBoard = {
      name: this.nameBoard,
      color: this.colorBoard,
    };
    this.firestore.updateBoard(id, newBoard);
    this.edit.emit({ id, ...newBoard });
  }

  @Output() edit = new EventEmitter<BoardDTO>();

  clearInput() {
    this.nameBoard = this.board.name;
    this.colorBoard = this.board.color;
  }
}
