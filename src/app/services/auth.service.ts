import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  user,
  getRedirectResult,
  UserInfo,
} from '@angular/fire/auth';
import { BehaviorSubject, firstValueFrom, map, Observable } from 'rxjs';
import { TaskeeUser } from '../interfaces/user';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  collectionData,
  doc,
  docData,
  DocumentData,
  DocumentSnapshot,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { reauthenticateWithCredential } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  utenteSub: BehaviorSubject<TaskeeUser | null> =
    new BehaviorSubject<TaskeeUser | null>(null);
  utente$ = this.utenteSub.asObservable();

  isLoggedInSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSub.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    user(auth).subscribe((data) => {
      if (!data) return;
      const userRef = doc(this.firestore, 'users', data.uid);
      getDoc(userRef).then((snap) => {
        if (snap.exists()) {
          this.updateTuser(snap);
        } else {
          this.utenteSub.next(null);
        }
      });
    });
  }

  logout() {
    this.utenteSub.next(null);
    this.isLoggedInSub.next(false);
    return signOut(this.auth);
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const credentials = await signInWithPopup(this.auth, provider);

    const { user: loggedUser } = credentials;

    // Controlla/crea doc custom Firestore:
    const userRef = doc(this.firestore, 'users', loggedUser.uid);
    const snap = await getDoc(userRef);
    this.updateTuser(snap);
    console.log('utente esistente', snap.data());

    if (!snap.exists()) {
      await setDoc(userRef, {
        email: loggedUser.email,
        displayName: loggedUser.displayName,
        photoURL: loggedUser.photoURL,
      });
      const docSnap = await getDoc(userRef);
      if (!docSnap) return;
      this.updateTuser(docSnap);
      console.log('utente creato', docSnap.data);
    }
  }

  updateTuser(snap: DocumentSnapshot<DocumentData, DocumentData>) {
    if (!snap.exists()) return;
    const id = snap.id;
    const boardsID: string[] = [];
    const userT = {
      boardsID,
      id,
      ...snap.data(),
    };
    this.utenteSub.next(userT as TaskeeUser);
    this.isLoggedInSub.next(true);
  }

  logged() {
    this.isLoggedInSub.next(true);
  }

  notLogged() {
    this.isLoggedInSub.next(false);
  }
}
