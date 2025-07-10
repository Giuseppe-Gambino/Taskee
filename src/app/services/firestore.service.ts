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
  getDoc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import {
  BehaviorSubject,
  combineLatest,
  firstValueFrom,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { Board, BoardDTO, Column, Task } from '../interfaces/board';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TaskeeUser } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(
    private oldFirestore: AngularFirestore,
    private firestore: Firestore
  ) {}

  // board ----------------------------------------------

  async addBoard(
    idUser: string,
    user: TaskeeUser,
    newBoard: { name: string; color: string }
  ) {
    const boardColl = collection(this.firestore, 'boards');
    const docRef = await addDoc(boardColl, newBoard);
    const id = docRef.id;

    this.boardToUser(idUser, id, user);

    const boardPreview: BoardDTO = {
      id,
      name: newBoard.name,
      color: newBoard.color,
    };

    return boardPreview;
  }

  async boardToUser(idUser: string, idboard: string, user: TaskeeUser) {
    const newiDs: string[] = user.boardsID;
    newiDs.push(idboard);

    const userRef = doc(this.firestore, 'users', idUser);
    await updateDoc(userRef, { boardsID: newiDs });
  }

  async getBoardDTOByid(idBoards: string[]) {
    const boardArr: BoardDTO[] = [];
    for (const uid of idBoards) {
      const boardRef = doc(this.firestore, 'boards', uid);
      const snap = await getDoc(boardRef);
      if (snap.exists()) {
        const id = snap.id;
        const data = snap.data() as BoardDTO;
        boardArr.push({
          id,
          name: data.name,
          color: data.color,
        });
      }
    }
    return boardArr;
  }

  async updateBoard(id: string, board: { name: string; color: string }) {
    const boardRef = doc(this.firestore, 'boards', id);
    await updateDoc(boardRef, board);
  }

  async deleteBoard(id: string) {
    const boardRef = doc(this.firestore, 'boards', id);
    await deleteDoc(boardRef);
  }

  // column -------------------------------------------

  addColumn(
    newColumn: { name: string; color: string; order: number },
    idBoard: string
  ) {
    return this.oldFirestore
      .collection<{ name: string; color: string; order: number }>(
        `boards/${idBoard}/columns`
      )
      .add(newColumn);
  }

  async updateColumnOrder(idBoard: string, column: Partial<Column>) {
    const columnRef = doc(
      this.firestore,
      `boards/${idBoard}/columns/${column.id}`
    );

    const newColumn: Partial<Column> = {
      order: column.order,
    };

    await updateDoc(columnRef, newColumn);
  }

  async updateColumn(idBoard: string, column: Partial<Column>) {
    const columnRef = doc(
      this.firestore,
      `boards/${idBoard}/columns/${column.id}`
    );

    const newColumn: Partial<Column> = {
      name: column.name,
      color: column.color,
    };

    await updateDoc(columnRef, newColumn);
  }

  async deleteColumn(idBoard: string, id: string) {
    const boardRef = doc(this.firestore, `boards/${idBoard}/columns`, id);
    await deleteDoc(boardRef);
  }

  getColumnByBoardId(idBoard: string): Observable<Column[] | undefined> {
    return this.oldFirestore
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

    return this.oldFirestore
      .collection<Partial<Task>>(`boards/${idBoard}/columns/${idColumn}/tasks`)
      .add(newTask);
  }

  updateTask(idBoard: string, idColumn: string, task: Task) {
    const newTask: Partial<Task> = {
      description: task.description,
      order: task.order,
    };

    console.log('aggiorno task');

    return this.oldFirestore
      .collection<Task>(`boards/${idBoard}/columns/${idColumn}/tasks`)
      .doc(task.id)
      .update(newTask);
  }

  deleteTask(idBoard: string, idColumn: string, idTask: string) {
    return this.oldFirestore
      .collection<Task>(`boards/${idBoard}/columns/${idColumn}/tasks`)
      .doc(idTask)
      .delete();
  }

  getTasksByBoardIdAndColumnId(
    idBoard: string,
    idColumn: string
  ): Observable<Task[]> {
    return this.oldFirestore
      .collection<Task>(`boards/${idBoard}/columns/${idColumn}/tasks`, (ref) =>
        ref.orderBy('order')
      )
      .valueChanges({ idField: 'id' });
  }

  // get full board ----------------------------------------------

  getFullBoard(idBoard: string): Observable<Board | undefined> {
    return this.oldFirestore
      .doc<Board>(`boards/${idBoard}`)
      .valueChanges()
      .pipe(
        switchMap((board) => {
          if (!board) return of(undefined);

          return this.oldFirestore
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

                    return this.oldFirestore
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
