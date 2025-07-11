import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TaskeeUser } from '../../interfaces/user';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  constructor(private auth: AuthService) {}

  user!: TaskeeUser | null;

  ngOnInit(): void {
    this.auth.utente$.subscribe((data) => {
      if (data) {
        this.user = data;
      } else {
        this.user = null;
      }
    });
  }

  isOpen: boolean | null = null;

  navToggle() {
    this.isOpen = !this.isOpen;
  }

  get navStateClass(): string | null {
    if (this.isOpen === true) return 'navExpand';
    if (this.isOpen === false) return 'navCollapse';
    return null;
  }

  close() {
    this.isOpen = false;
  }
}
