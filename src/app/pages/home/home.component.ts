import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { TaskeeUser } from '../../interfaces/user';
import { Board } from '../../interfaces/board';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  user!: TaskeeUser;

  boardsArr: { name: string; color: string }[] = [];

  constructor(private firestore: FirestoreService, private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.utente$.subscribe((data) => {
      if (!data) return;
      this.user = data;
      console.log(this.user);
    });
  }

  createNewBoard(name: string, color: string) {
    const newBoard = { name: name, color: color };

    this.firestore.addBoard(this.user.id, this.user, newBoard).then((board) => {
      this.boardsArr.push(board);
    });
  }
}
