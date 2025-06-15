import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom, Observable } from 'rxjs';
import { Board, Column, Task } from '../iterfaces/board';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  async getBoard(idBoard: string): Promise<Board> {
    const board = await firstValueFrom(
      this.firestore.doc<Board>(`board/${idBoard}`).valueChanges()
    );

    const column: Column[] = await firstValueFrom(
      this.firestore
        .collection<Column>(`board/${idBoard}/Column`)
        .valueChanges({ idField: 'id' })
    );

    console.log('columns', column);

    column.forEach((col) => (col.task = []));

    await Promise.all(
      column.map(async (col) => {
        const tasks = await firstValueFrom(
          this.firestore
            .collection<Task>(`board/${idBoard}/Column/${col.id}/task`)
            .valueChanges({ idField: 'id' })
        );
        col.task = tasks;
      })
    );

    if (!board) throw new Error('Board non trovata');

    const fullBoard: Board = {
      id: idBoard,
      name: board.name,
      columns: column,
    };

    return fullBoard;
  }
}
