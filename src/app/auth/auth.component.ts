import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  constructor(public auth: AuthService) {
    this.auth.utente$.subscribe((data) => {
      console.log('user', data);
    });
  }

  login() {
    this.auth.loginWithGoogle();
  }

  logout() {
    this.auth.logout();
  }

  see(): void {}
}
