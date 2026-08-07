import { Component, DestroyRef, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService, CurrentUser } from '../../../features/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { ToastService } from '../../../core/services/toast.service';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { InitialsPipe } from '../../pipes/initials.pipe';
import { IconComponent } from '../../icons/icon.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [IconComponent, ClickOutsideDirective, DropdownMenuComponent, InitialsPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private destroyRef: DestroyRef,
    private toaster: ToastService,
  ) {}
  user: CurrentUser | null = null;
  userInitial: string = '?';
  openDropdownMenu = false;

  logoutItems = [
    {
      label: 'Logout',
      danger: true,
      action: () => this.logout(),
      icon: 'logout'
    },
  ];

  @Output() menuClick = new EventEmitter<void>();

  ngOnInit() {
    this.authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
      this.user = user;
    });
  }

  openMenu() {
    this.menuClick.emit();
  }

  openDropDown() {
    this.openDropdownMenu = !this.openDropdownMenu;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
        (this.router.navigate(['/login']),
          this.toaster.showError('Logout failed, please try again.'));
      },
    });
  }
}
