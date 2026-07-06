import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
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
import { LogoIconComponent } from '../../icons/logo-icon.component';
import { filter, Subscription } from 'rxjs';

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
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private routerSub?: Subscription;

  @Input() mobileOpen = false;
  @Output() mobileOpenChange = new EventEmitter<boolean>();
  @Output() collapsedChange = new EventEmitter<boolean>();

  get navItems() {
    const id = this.projectId;
    return [
      { label: 'Projects', route: `/project`, icon: 'projects' },
      { label: 'Tasks', route: `/project/${id}/tasks`, icon: 'tasks' },
      { label: 'Members', route: `/project/${id}/members`, icon: 'members' },
      { label: 'Epics', route: `/project/${id}/epics`, icon: 'epics' },
      { label: 'Project Details', route: `/project/${id}/edit`, icon: 'details' },
    ];
  }

  collapsed = false;
  isMobile = window.innerWidth < 1024;
  projectId: string | null = null;

  ngOnInit() {
    this.updateProjectId();
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.updateProjectId());
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
  }

  private updateProjectId() {
    let r = this.route.root;
    while (r.firstChild) r = r.firstChild;
    this.projectId = r.snapshot.paramMap.get('id');
  }

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
