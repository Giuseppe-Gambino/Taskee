import { Component } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Colonna, Task } from '../../iterfaces/colonna';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  colonne: Colonna[] = [
    {
      name: 'Da fare',
      color: '#1f201e',

      tasks: [
        { description: 'drag & drop' },
        { description: 'studiare react' },
        { description: 'collegare firebase' },
      ],
    },
    {
      name: 'In corso',
      color: '#533F03',
      tasks: [{ description: 'ricreare Trello' }],
    },
    {
      name: 'Fatto',
      color: '#174B35',

      tasks: [],
    },
  ];

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
    console.log(this.colonne);
  }

  createNewTask(index: number, text: string) {
    const newTastk: Task = {
      description: text,
    };
    this.colonne[index].tasks.push(newTastk);
    console.log(this.colonne);
  }
}
