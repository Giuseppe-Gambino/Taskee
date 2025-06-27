import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
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
