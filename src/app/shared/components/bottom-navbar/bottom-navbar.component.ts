import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { EpicsIconComponent, ProjectsIconComponent, TasksIconComponent } from '../../icons/index';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavbarComponent {
  @Input() navItems: any[] = [];
}
