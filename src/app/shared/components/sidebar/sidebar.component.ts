import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  DetailsComponent,
  EpicsComponent,
  MembersComponent,
  ProjectsComponent,
  TasksComponent,
  CollapseOpenIconComponent,
} from '../../icons/index';
import { NgComponentOutlet } from '@angular/common';
import { CollapseIconComponent } from '../../icons/collapse-icon.component';
import { LogoutIconComponent } from '../../icons/logout-icon.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgComponentOutlet,
    CollapseIconComponent,
    LogoutIconComponent,
    CollapseOpenIconComponent,
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
    { label: 'Projects', route: '/project', icon: ProjectsComponent },
    { label: 'Project Epics', route: '/epics', icon: EpicsComponent },
    { label: 'Project Tasks', route: '/tasks', icon: TasksComponent },
    { label: 'Project Members', route: '/members', icon: MembersComponent },
    { label: 'Project Details', route: '/details', icon: DetailsComponent },
  ];

  collapsed = false;

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
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        this.router.navigate(['/login']);
      },
      error: () => {
        console.log('Logout failed, please try again.');
      },
    });
  }
}
