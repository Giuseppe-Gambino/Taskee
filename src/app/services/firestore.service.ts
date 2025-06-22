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
import { Board, Column, Task } from '../iterfaces/board';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  addBoard(board: Board) {
    return this.firestore.collection<Board>('boards').add(board);
  }

  addColumn(newColumn: Column, idBoard: string) {
    return this.firestore
      .collection<Column>(`boards/${idBoard}/columns`)
      .add(newColumn);
  }

  addTask(newTask: Task, idBoard: string, idColumn: string) {
    return this.firestore
      .collection<Task>(`boards/${idBoard}/columns/${idColumn}/tasks`)
      .add(newTask);
  }

  getBoards(): Observable<Board[]> {
    return this.firestore
      .collection<Board>('boards')
      .valueChanges({ idField: 'id' });
  }

  getBoardByid(id: string): Observable<Board | undefined> {
    return this.firestore.collection<Board>('boards').doc(id).valueChanges();
  }

  getColumnByBoardId(idBoard: string): Observable<Column[] | undefined> {
    return this.firestore
      .collection<Column>(`boards/${idBoard}/columns`)
      .valueChanges({ idField: 'id' });
  }

  getTasksByBoardIdAndColumnId(
    idBoard: string,
    idColumn: string
  ): Observable<Task[]> {
    return this.firestore
      .collection<Task>(`boards/${idBoard}/columns/${idColumn}/tasks`)
      .valueChanges();
  }

  updateBoard(id: string, board: Partial<Board>) {
    return this.firestore.collection<Board>('boards').doc(id).update(board);
  }

  deleteBoard(id: string) {
    return this.firestore.collection<Board>('boards').doc(id).delete();
  }

  getColumns(boardId: string): Observable<Column[]> {
    return this.firestore
      .collection(`boards/${boardId}/columns`)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Column;
            const id = a.payload.doc.id;
            return data;
          })
        )
      );
  }

  getFullBoard(idBoard: string): Observable<Board | undefined> {
    return this.firestore
      .doc<Board>(`boards/${idBoard}`)
      .valueChanges()
      .pipe(
        switchMap((board) => {
          if (!board) return of(undefined);

          return this.firestore
            .collection<Column>(`boards/${idBoard}/columns`)
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
