import { Component, Input } from '@angular/core';
import { Task } from '../../interfaces/board';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  constructor(private firestore: FirestoreService) {}

  @Input() task!: Task;
  @Input() boardId!: string;
  @Input() sezioneId!: string;

  deleteTask() {
    if (this.task.id === undefined) return;
    this.firestore.deleteTask(this.boardId, this.sezioneId, this.task.id);
  }
}
