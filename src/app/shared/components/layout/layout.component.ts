import { Component, HostListener, inject } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';
import { BottomNavbarComponent } from '../bottom-navbar/bottom-navbar.component';
import { ProjectContextService } from '../../../core/services/project-context.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, RouterOutlet, ToastComponent, BottomNavbarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  private projectContextService = inject(ProjectContextService);

  isCollapsed = false;
  isMobileOpen = false;
  isMobile = window.innerWidth < 1024;

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  toggleMobileSidebar() {
    this.isMobileOpen = !this.isMobileOpen;
  }

  get navItems() {
    const id = this.projectContextService.activeProjectId();

    return [
      {
        label: this.isMobile ? 'Projects' : 'Projects',
        route: '/project',
        icon: 'projects',
      },
      {
        label: this.isMobile ? 'Tasks' : 'Project Tasks',
        route: `/project/${id}/tasks`,
        icon: 'tasks',
      },
      {
        label: this.isMobile ? 'Members' : 'Project Members',
        route: `/project/${id}/members`,
        icon: 'members',
      },
      {
        label: this.isMobile ? 'Epics' : 'Project Epics',
        route: `/project/${id}/epics`,
        icon: 'epics',
      },
      {
        label: this.isMobile ? 'Details' : 'Project Details',
        route: `/project/${id}/edit`,
        icon: 'details',
      },
    ];
  }

  collapsed = false;
}
