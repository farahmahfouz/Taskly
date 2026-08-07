import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconComponent } from '../../icons/icon.component';

export interface DropdownItem {
  label: string;
  icon?: string;
  danger?: boolean;
  action: () => void;
}

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuComponent {
  @Input() items: DropdownItem[] = [];
  @Input() top = 'top-8';
  @Input() width = 'w-40';
}
