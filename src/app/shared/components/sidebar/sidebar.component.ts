import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DetailsComponent, EpicsComponent, MembersComponent, ProjectsComponent, TasksComponent, CollapseOpenIconComponent } from '../../icons/index';
import { NgComponentOutlet } from '@angular/common';
import { CollapseIconComponent } from '../../icons/collapse-icon.component';
import { LogoutIconComponent } from '../../icons/logout-icon.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgComponentOutlet,
    CollapseIconComponent,
    LogoutIconComponent,
    CollapseOpenIconComponent
],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
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
  
}
