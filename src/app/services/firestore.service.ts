import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  docData,
  CollectionReference,
  DocumentData,
} from '@angular/fire/firestore';
import {
  combineLatest,
  firstValueFrom,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { Board, Column, Task } from '../interfaces/board';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  // board ----------------------------------------------

  addBoard(board: Board) {
    return this.firestore.collection<Board>('boards').add(board);
  }

  getBoards(): Observable<Board[]> {
    return this.firestore
      .collection<Board>('boards')
      .valueChanges({ idField: 'id' });
  }

  getBoardByid(id: string): Observable<Board | undefined> {
    return this.firestore
      .collection<Board>('boards')
      .doc(id)
      .valueChanges({ idField: 'id' });
  }

  updateBoard(id: string, board: Partial<Board>) {
    return this.firestore.collection<Board>('boards').doc(id).update(board);
  }

  deleteBoard(id: string) {
    return this.firestore.collection<Board>('boards').doc(id).delete();
  }

  // column -------------------------------------------

  addColumn(
    newColumn: { name: string; color: string; order: number },
    idBoard: string
  ) {
    return this.firestore
      .collection<{ name: string; color: string; order: number }>(
        `boards/${idBoard}/columns`
      )
      .add(newColumn);
  }

  updateColumn(idBoard: string, column: Column) {
    const newColumn: Partial<Column> = {
      name: column.name,
      color: column.color,
      order: column.order,
    };

    return this.firestore
      .collection<Column>(`boards/${idBoard}/columns`)
      .doc(column.id)
      .update(newColumn);
  }

  getColumnByBoardId(idBoard: string): Observable<Column[] | undefined> {
    return this.firestore
      .collection<Column>(`boards/${idBoard}/columns`, (ref) =>
        ref.orderBy('order')
      )
      .valueChanges({ idField: 'id' });
  }

  // task -------------------------------------------------

  addTask(task: Task, idBoard: string, idColumn: string) {
    const newTask: Partial<Task> = {
      description: task.description,
      order: task.order,
    };

    return this.firestore
      .collection<Partial<Task>>(`boards/${idBoard}/columns/${idColumn}/tasks`)
      .add(newTask);
  }

  updateTask(idBoard: string, idColumn: string, task: Task) {
    const newTask: Partial<Task> = {
      description: task.description,
      order: task.order,
    };

    console.log('aggiorno task');

    return this.firestore
      .collection<Task>(`boards/${idBoard}/columns/${idColumn}/tasks`)
      .doc(task.id)
      .update(newTask);
  }

  deleteTask(idBoard: string, idColumn: string, idTask: string) {
    return this.firestore
      .collection<Task>(`boards/${idBoard}/columns/${idColumn}/tasks`)
      .doc(idTask)
      .delete();
  }

  getTasksByBoardIdAndColumnId(
    idBoard: string,
    idColumn: string
  ): Observable<Task[]> {
    return this.firestore
      .collection<Task>(`boards/${idBoard}/columns/${idColumn}/tasks`, (ref) =>
        ref.orderBy('order')
      )
      .valueChanges({ idField: 'id' });
  }

  // get full board ----------------------------------------------

  getFullBoard(idBoard: string): Observable<Board | undefined> {
    return this.firestore
      .doc<Board>(`boards/${idBoard}`)
      .valueChanges()
      .pipe(
        switchMap((board) => {
          if (!board) return of(undefined);

          return this.firestore
            .collection<Column>(`boards/${idBoard}/columns`, (ref) =>
              ref.orderBy('order')
            )
            .snapshotChanges()
            .pipe(
              switchMap((columnSnaps) => {
                if (!columnSnaps.length) return of({ ...board, columns: [] });

                const columnsWithTasks$: Observable<Column>[] = columnSnaps.map(
                  (colSnap) => {
                    const columnId = colSnap.payload.doc.id;
                    const columnData = colSnap.payload.doc.data() as Column;

                    return this.firestore
                      .collection<Task>(
                        `boards/${idBoard}/columns/${columnId}/tasks`,
                        (ref) => ref.orderBy('order')
                      )
                      .valueChanges({ idField: 'id' })
                      .pipe(
                        map((tasks) => ({
                          ...columnData,
                          id: columnId,
                          tasks: tasks || [],
                        }))
                      );
                  }
                );

                return combineLatest(columnsWithTasks$).pipe(
                  map((columns) => ({ ...board, id: idBoard, columns }))
                );
              })
            );
        })
      );
  }
}
