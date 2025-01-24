import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AppUser } from '../models/app-user';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  appUser: AppUser | undefined;

  constructor(private authService: AuthService) {
    this.authService.appUser$.subscribe((user) => (this.appUser = user));
  }

  logout() {
    this.authService.logOut();
  }
}
