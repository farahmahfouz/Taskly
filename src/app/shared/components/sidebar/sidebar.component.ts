import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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
import { STORAGE_KEYS } from '../../../core/utils/constants';
import { MembersIconComponent } from '../../icons/members-icon.component';
import { DetailsIconComponent } from '../../icons/details-icon.component';
import { LogoIconComponent } from "../../icons/logo-icon.component";

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
    LogoIconComponent
],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  @Input() mobileOpen = false;
  @Output() mobileOpenChange = new EventEmitter<boolean>();
  @Output() collapsedChange = new EventEmitter<boolean>();

  navItems = [
    { label: 'Projects', route: '/project', icon: 'projects' },
    { label: 'Project Epics', route: '/epics', icon: 'epics' },
    { label: 'Project Tasks', route: '/tasks', icon: 'tasks' },
    { label: 'Project Members', route: '/members', icon: 'members' },
    { label: 'Project Details', route: '/details', icon: 'details' },
  ];

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
