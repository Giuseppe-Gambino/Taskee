import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit(): void {
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

  see(): void {
    this.auth.utente$.subscribe((data) => {
      console.log('user', data);
    });
  }
}
