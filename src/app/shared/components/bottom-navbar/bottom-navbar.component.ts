import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {
  CollapseOpenIconComponent,
  EpicsIconComponent,
  ProjectsIconComponent,
  TasksIconComponent,
} from '../../icons/index';
import { CollapseIconComponent } from '../../icons/collapse-icon.component';
import { LogoutIconComponent } from '../../icons/logout-icon.component';
import { MembersIconComponent } from '../../icons/members-icon.component';
import { DetailsIconComponent } from '../../icons/details-icon.component';

@Component({
  selector: 'app-bottom-navbar',
  standalone: true,
  imports: [
    RouterLink,
    ProjectsIconComponent,
    EpicsIconComponent,
    MembersIconComponent,
    TasksIconComponent,
    DetailsIconComponent,
    RouterLinkActive,
  ],
  templateUrl: './bottom-navbar.component.html',
  styleUrl: './bottom-navbar.component.css',
})
export class BottomNavbarComponent {
  @Input() navItems: any[] = [];
}
