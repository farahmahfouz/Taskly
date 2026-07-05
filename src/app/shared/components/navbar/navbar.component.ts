import { Component, DestroyRef, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService, CurrentUser } from '../../../core/services/auth.service';
import { MenuIconComponent } from '../../icons/Menu-icon.component';
import { LogoutIconComponent } from '../../icons/logout-icon.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { STORAGE_KEYS } from '../../../core/utils/constants';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenuIconComponent, LogoutIconComponent, ClickOutsideDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private destroyRef: DestroyRef,
  ) {}
  user: CurrentUser | null = null;
  userInitial: string = '?';
  openDropdownMenu = false;

  @Output() menuClick = new EventEmitter<void>();

  ngOnInit() {
    this.authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
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

  openMenu() {
    this.menuClick.emit();
  }

  openDropDown() {
    this.openDropdownMenu = !this.openDropdownMenu;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

        this.router.navigate(['/login']);
      },
      error: () => {
        console.log('Logout failed, please try again.');
      },
    });
  }
}
