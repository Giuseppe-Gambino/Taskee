import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { TaskeeUser } from '../../interfaces/user';
import { Board, BoardDTO } from '../../interfaces/board';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  user!: TaskeeUser;

  boardsArr!: BoardDTO[];

  constructor(private firestore: FirestoreService, private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.utente$.subscribe((data) => {
      if (!data) return;
      this.user = data;

      this.firestore.getBoardByid(this.user.boardsID).then((boards) => {
        this.boardsArr = boards;
        console.log('Boards:', this.boardsArr);
      });
    });
  }

  nameBoard: string | null = null;
  colorBoard: string = '#212121';

  createNewBoard() {
    if (!this.nameBoard) return;
    const newBoard = { name: this.nameBoard, color: this.colorBoard };

    this.firestore.addBoard(this.user.id, this.user, newBoard).then((board) => {
      this.boardsArr.push(board);
    });

    this.clearInput();
  }

  clearInput() {
    this.nameBoard = null;
    this.colorBoard = '#212121';
  }

  filterDelete(id: string) {
    this.boardsArr = this.boardsArr.filter((board) => board.id !== id);
  }

  editBoard(board: BoardDTO) {
    this.boardsArr = this.boardsArr.map((item) => {
      if (item.id === board.id) {
        return board;
      }
      return item;
    });
  }
}
