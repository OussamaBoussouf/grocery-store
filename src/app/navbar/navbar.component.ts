import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  user$ = this.authService.user$;

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.signOut();
  }
}
