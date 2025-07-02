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
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  utenteSub: BehaviorSubject<UserInfo | null> =
    new BehaviorSubject<UserInfo | null>(null);
  utente$ = this.utenteSub.asObservable();

  constructor(private auth: Auth) {
    user(auth).subscribe((data) => {
      if (!data?.providerData[0]) return;
      this.utenteSub.next(data?.providerData[0]);
    });
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return signInWithPopup(this.auth, provider);
  }

  logout() {
    return signOut(this.auth);
  }
}
