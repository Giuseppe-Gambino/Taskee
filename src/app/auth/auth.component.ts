import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TaskeeUser } from '../interfaces/user';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  constructor(public auth: AuthService) {}

  user!: TaskeeUser | null;

  ngOnInit(): void {
    this.auth.utente$.subscribe((data) => {
      console.log('user', data);
      this.user = data;
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
