import { Component, DestroyRef, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService, CurrentUser } from '../../../features/auth/auth.service';
import { MenuIconComponent } from '../../icons/Menu-icon.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { ToastService } from '../../../core/services/toast.service';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { InitialsPipe } from '../../pipes/initials.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenuIconComponent, ClickOutsideDirective, DropdownMenuComponent, InitialsPipe],
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
    },
  ];

  @Output() menuClick = new EventEmitter<void>();

  ngOnInit() {
    this.authService.currentUser$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
      console.log(user)
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
