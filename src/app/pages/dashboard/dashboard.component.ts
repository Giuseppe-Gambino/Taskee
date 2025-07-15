import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
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
import { TaskeeUser } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(
    private firestore: FirestoreService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {}

  subscription = new Subscription();

  user!: TaskeeUser;

  idBoard!: string;
  board!: Board;

  ngOnInit() {
    this.subscription.add(
      this.auth.utente$.subscribe((data) => {
        if (!data) return;
        this.user = data;
      })
    );

    this.subscription.add(
      this.route.paramMap.subscribe((params) => {
        const id = params.get('id');
        if (!id) return;
        this.idBoard = id;
      })
    );

    this.subscription.add(
      this.firestore.getFullBoard(this.idBoard).subscribe((data) => {
        if (data) {
          this.board = data;
          console.log(data);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // costruisce un array di id column per andare ad assegnare il collegamento delle list per il drag-n-drop (per dire alle liste quali elementi possono ricevere in base alla lista di provenienza)
  get connectedDropListsIds(): string[] {
    return this.board.columns?.map((col: any, i: number) => col.id) || [];
  }

  // trackBy per il ngfor*  permette di non aggiornare l'intero ngfor ma solo l'elemento

  trackByColumnId(index: number, column: Column) {
    return column.id;
  }

  trackByTaskId(index: number, task: Task) {
    return task.id;
  }

  // prende la column droppata e modifica l'ordine
  dropColumn(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    // controlla se la column si è spostata e l'aggiorna se serve
    if (event.currentIndex !== event.previousIndex) {
      this.setNewOrderForElementBetween2(event, '');
      this.checkDuplicates(event, '');
    }
  }

  // prende la task droppata e modifica l'ordine e/o la column
  drop(event: CdkDragDrop<any[]>) {
    // id delle column
    const idColumn: string = event.container.id;
    const idColumnPre: string = event.previousContainer.id;

    // if che capisce se deve muovere una task dentro l'array o deve trasferirla di array
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // if che controlla se la task si è spostata
      if (event.currentIndex !== event.previousIndex) {
        this.setNewOrderForElementBetween2(event, idColumn);
        // controlla se ci sono task con order uguali
        this.checkDuplicates(event, idColumn);
      }
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // if che controlla se il nuovo array ha task all'interno, e quindi se aggiornare l'order o no
      if (event.container.data.length !== 1) {
        this.setNewOrderForElementBetween2(event, idColumnPre);
      }

      const task: Task = event.container.data[event.currentIndex];

      // trasferisce la task
      this.transferTask(task, idColumn, idColumnPre);

      this.checkDuplicates(event, idColumn);
    }
  }

  // trasferisce la task da una collection all'altra facendo una delete e create
  transferTask(task: Task, idColumn: string, idColumnPre: string) {
    if (!task.id) return;
    this.firestore.deleteTask(this.idBoard, idColumnPre, task.id);
    this.firestore.addTask(task, this.idBoard, idColumn);
  }

  // funzione che gestisce/aggiorna l'ordinamento delle task
  setNewOrderForElementBetween2(event: CdkDragDrop<any[]>, idColumn: string) {
    const element: Task | Column = event.container.data[event.currentIndex];

    // index degli elementi per capire quale slot assegnare alla task spostata
    let indexElementTop: number;
    let indexElementBottom: number;

    // se la task è stata messa in fondo, questa prende l'order della penultima e aggiunge 100
    if (event.container.data.length === event.currentIndex + 1) {
      indexElementTop = event.currentIndex - 1;

      element.order = Math.floor(
        event.container.data[indexElementTop].order + 100
      );

      this.updateElement(element, idColumn);

      return;

      // se la task è stata messa in prima posizione, questa prende l'order della seconda e divide per 100
    } else if (event.currentIndex - 1 < 0) {
      indexElementBottom = event.currentIndex + 1;

      element.order = Math.floor(
        event.container.data[indexElementBottom].order / 2
      );

      this.updateElement(element, idColumn);

      return;

      // altrimenti prende l'order dalla somma divisa per 2, della task sotto e sopra di essa
    } else {
      indexElementTop = event.currentIndex - 1;
      indexElementBottom = event.currentIndex + 1;
    }

    const elementTop = event.container.data[indexElementTop].order;
    const elementBottom = event.container.data[indexElementBottom].order;

    element.order = Math.floor((elementTop + elementBottom) / 2);

    // fa l'update delle task
    this.updateElement(element, idColumn);

    console.log(event.container.data);
  }

  // controlla se ci sono task con order uguali
  checkDuplicates(event: CdkDragDrop<any[]>, idColum: string) {
    const data = event.container.data;

    const seen = new Set<number>();
    for (const item of data) {
      if (seen.has(item.order)) {
        this.normalizer(data, idColum);
      }
      seen.add(item.order);
    }
  }
  //  in caso di duplicati li normalizza, andando ad assegnare gli order in base all'(index + 1) * 100
  normalizer(element: Task[] | Column[], idColumn: string) {
    for (let i = 0; i < element.length; i++) {
      element[i].order = (i + 1) * 100;
      this.updateElement(element[i], idColumn);
    }
  }

  nameColumn: string | null = null;
  colorColumn: string = '#212121';

  createNewColumn() {
    if (!this.nameColumn) return;
    const newColumn = {
      name: this.nameColumn,
      color: this.colorColumn,
      order: (this.board.columns.length + 1) * 100,
    };

    this.firestore.addColumn(newColumn, this.idBoard);
    this.clearInput();
  }

  description: string | null = null;

  createNewTask(length: number, idColumn: string) {
    if (!this.description) return;
    const newTastk = {
      description: this.description,
      order: (length + 1) * 100,
    };

    this.firestore.addTask(newTastk, this.idBoard, idColumn);
    this.clearInput();
  }

  clearInput() {
    this.description = null;
    this.nameColumn = null;
    this.colorColumn = '#212121';
  }

  isColumn(el: Task | Column): el is Column {
    return 'name' in el && 'order' in el;
  }

  // controlla se l'elemento droppato è una task o una column e usa il metodo corrispondente
  updateElement(element: Task | Column, idColumn: string) {
    if (this.isColumn(element)) {
      this.firestore.updateColumnOrder(this.idBoard, element);
    } else {
      this.firestore.updateTask(this.idBoard, idColumn, element);
    }
  }

  updateColumn(idColumn: string, name: string, color: string) {
    const newColumn = {
      id: idColumn,
      name: name,
      color: color,
    };
    this.firestore.updateColumn(this.idBoard, newColumn);
  }

  deleteColumn(idColumn: string) {
    this.firestore.deleteColumn(this.idBoard, idColumn);
  }

  // animazione per singola column
  grabStart(col: HTMLElement) {
    col.classList.add('column-move');
  }

  grabEnd(col: HTMLElement) {
    col.classList.remove('column-move');
  }

  @ViewChild('addCol') addCollRef!: ElementRef<HTMLDialogElement>;

  callModal() {
    this.addCollRef.nativeElement.showModal();
  }
}
