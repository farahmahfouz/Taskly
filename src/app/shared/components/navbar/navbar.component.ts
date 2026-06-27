import { Component, OnInit } from '@angular/core';
import { AuthService, CurrentUser } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  constructor(private authService: AuthService) {}
  user: CurrentUser | null = null;
  userInitial: string = '?';

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user?.name) {
        this.userInitial = this.getInitials(user.name);
      }
    });
  }

  getInitials(name: string): string {
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase(); 
    return (words[0][0] + words[1][0]).toUpperCase(); 
  }
}
