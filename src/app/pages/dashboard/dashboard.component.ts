import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragStart,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Board, Column, Task } from '../../interfaces/board';
import { FirestoreService } from '../../services/firestore.service';
import { Observable } from 'rxjs';
import { DragElement } from '../../interfaces/drag-element';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(private firestore: FirestoreService) {}
  board!: Board;

  grabStart(col: HTMLElement) {
    col.classList.add('column-move');
  }

  grabEnd(col: HTMLElement) {
    col.classList.remove('column-move');
  }

  ngOnInit() {
    this.firestore.getFullBoard('hFOcPrZR9gzg6GoQMO4Y').subscribe((data) => {
      if (data) {
        this.board = data;

        console.log(data);
      }
    });
  }

  get connectedDropListsIds(): string[] {
    return (
      this.board?.columns?.map((col: any, i: number) => 'task-list-' + i) || []
    );
  }

  // trackBy per il ngfor*

  trackByColumnId(index: number, column: Column) {
    return column.id;
  }

  trackByTaskId(index: number, task: Task) {
    return task.id;
  }

  dropColumn(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    if (event.currentIndex !== event.previousIndex) {
      this.setNewOrderForElementBetween2(event, '');
    } else {
      console.log('non si e spostato');
    }

    this.chackDuplicates(event, '');

    console.log('array finale cambio', event.container.data);
  }

  drop(event: CdkDragDrop<any[]>, idColumn: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (event.currentIndex !== event.previousIndex) {
        this.setNewOrderForElementBetween2(event, idColumn);
      } else {
        console.log('non si e spostato');
      }

      this.chackDuplicates(event, idColumn);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (event.container.data.length !== 1) {
        this.setNewOrderForElementBetween2(event, idColumn);
      }

      this.chackDuplicates(event, idColumn);
    }
    console.log('array finale cambio', event.container.data);
  }

  setNewOrderForElementBetween2(event: CdkDragDrop<any[]>, idColumn: string) {
    const element: Task | Column = event.container.data[event.currentIndex];

    console.log(element);

    let indexElementTop: number;
    let indexElementBottom: number;

    if (event.container.data.length === event.currentIndex + 1) {
      console.log('elemento spostato nell ultima posizione');

      indexElementTop = event.currentIndex - 1;

      element.order = Math.floor(
        event.container.data[indexElementTop].order + 100
      );

      this.updateElement(element, idColumn);

      return;
    } else if (event.currentIndex - 1 < 0) {
      console.log('elemento spostato nella prima posizione');

      indexElementBottom = event.currentIndex + 1;

      element.order = Math.floor(
        event.container.data[indexElementBottom].order / 2
      );

      this.updateElement(element, idColumn);

      return;
    } else {
      indexElementTop = event.currentIndex - 1;
      indexElementBottom = event.currentIndex + 1;
    }

    const elementTop = event.container.data[indexElementTop].order;
    const elementBottom = event.container.data[indexElementBottom].order;

    element.order = Math.floor((elementTop + elementBottom) / 2);

    this.updateElement(element, idColumn);
  }

  chackDuplicates(event: CdkDragDrop<any[]>, idColum: string) {
    const data = event.container.data;

    const seen = new Set<number>();
    for (const item of data) {
      if (seen.has(item.order)) {
        console.log('DUPLICATI');
        this.normalizer(data, idColum);
      }
      seen.add(item.order);
    }
  }

  normalizer(element: Task[] | Column[], idColumn: string) {
    for (let i = 0; i < element.length; i++) {
      element[i].order = (i + 1) * 100;
      this.updateElement(element[i], idColumn);
    }
  }

  createNewColumn(name: string, color: string) {
    const newColumn = {
      name,
      color,
      order: (this.board.columns.length + 1) * 100,
    };

    this.firestore.addColumn(newColumn, this.board.id);
  }

  createNewTask(length: number, text: string, idColumn: string) {
    const newTastk = {
      description: text,
      order: (length + 1) * 100,
    };
    this.firestore.addTask(newTastk, this.board.id, idColumn);
  }

  isColumn(el: Task | Column): el is Column {
    return 'name' in el && 'order' in el;
  }

  updateElement(element: Task | Column, idColumn: string) {
    if (!element.id) return;
    if (this.isColumn(element)) {
      console.log('sono una collumn');
      this.firestore.updateColumn(this.board.id, element);
    } else {
      console.log('non sono una column');
      this.firestore.updateTask(this.board.id, idColumn, element);
    }
  }
}
