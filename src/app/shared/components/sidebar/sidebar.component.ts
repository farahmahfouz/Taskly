import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  CollapseOpenIconComponent,
  EpicsIconComponent,
  ProjectsIconComponent,
  TasksIconComponent,
} from '../../icons/index';
import { CollapseIconComponent } from '../../icons/collapse-icon.component';
import { LogoutIconComponent } from '../../icons/logout-icon.component';
import { AuthService } from '../../../features/auth/auth.service';
import { HostListener } from '@angular/core';
import { MembersIconComponent } from '../../icons/members-icon.component';
import { DetailsIconComponent } from '../../icons/details-icon.component';
import { LogoIconComponent } from '../../icons/logo-icon.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    ProjectsIconComponent,
    EpicsIconComponent,
    MembersIconComponent,
    TasksIconComponent,
    DetailsIconComponent,
    RouterLinkActive,
    CollapseIconComponent,
    LogoutIconComponent,
    CollapseOpenIconComponent,
    LogoIconComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toaster = inject(ToastService);

  @Input() mobileOpen = false;
  @Output() mobileOpenChange = new EventEmitter<boolean>();
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Input() navItems: any[] = [];

  collapsed = false;
  isMobile = window.innerWidth < 768;

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.collapsed = false;
      this.collapsedChange.emit(false);
    }
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  closeSidebar() {
    this.mobileOpen = false;
    this.mobileOpenChange.emit(false);
  }

  logout(event: MouseEvent) {
    event.stopPropagation();
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toaster.showError('Logout failed, please try again.');
      },
    });
  }
}
