import { Component, OnInit } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Board, Column, Task } from '../../iterfaces/board';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(private db: FirestoreService) {}

  board!: Board;

  ngOnInit(): void {
    this.db.getBoard('5A4gTQAbN1URNNbfQTnO').then((board: Board) => {
      this.board = board;
      console.log('fullboard', board);
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  createNewTask(index: number, text: string) {
    const newTastk: Task = {
      description: text,
    };
    this.board.columns[index].task.push(newTastk);
  }
}
