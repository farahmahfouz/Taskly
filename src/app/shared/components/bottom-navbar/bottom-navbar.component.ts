import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../../icons/icon.component';
import { StatsIconComponent } from '../../icons';

@Component({
  selector: 'app-bottom-navbar',
  standalone: true,
  imports: [RouterLink, IconComponent, RouterLinkActive, StatsIconComponent],
  templateUrl: './bottom-navbar.component.html',
  styleUrl: './bottom-navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavbarComponent {
  @Input() navItems: any[] = [];
}
