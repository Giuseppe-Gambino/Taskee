import { Component } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  colonne: any[] = [
    {
      name: 'Da fare',
      color: '#1f201e',
      order: 0,
      tasks: [
        { order: 1, description: 'darggable' },
        { order: 2, description: 'move' },
        { order: 3, description: 'order' },
      ],
    },
    { name: 'In corso', color: '#533F03', order: 1, tasks: [] },
    { name: 'Fatto', color: '#174B35', order: 2, tasks: [] },
  ];

  drop(event: CdkDragDrop<any[]>) {
    console.log(event);
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
