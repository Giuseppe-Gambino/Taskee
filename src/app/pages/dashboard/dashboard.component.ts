import { Component, OnInit } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Board, Column, Task } from '../../iterfaces/board';
import { FirestoreService } from '../../services/firestore.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(private firestore: FirestoreService) {}
  board!: Board;

  ngOnInit() {
    this.firestore.getFullBoard('hFOcPrZR9gzg6GoQMO4Y').subscribe((data) => {
      if (data) {
        this.board = data;
        console.log(data);
      }
    });
  }

  // trackBy per il ngfor*

  trackByColumnId(index: number, column: Column) {
    return column.id;
  }

  trackByTaskId(index: number, task: Task) {
    return task.id;
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

  createNewColumn(name: string, color: string) {
    const newColumn: Column = {
      name,
      color,
      tasks: [],
    };

    this.firestore.addColumn(newColumn, this.board.id);
  }

  createNewTask(indexTask: number, text: string, idColumn: string) {
    const newTastk = {
      description: text,
      order: indexTask + 1,
    };
    this.firestore.addTask(newTastk, this.board.id, idColumn);
  }
}
