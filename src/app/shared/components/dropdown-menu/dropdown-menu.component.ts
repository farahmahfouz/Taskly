import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface DropdownItem {
  label: string;
  icon?: string;
  danger?: boolean;
  action: () => void;
}

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuComponent {
  @Input() items: DropdownItem[] = [];
  @Input() top = 'top-8';
  @Input() width = 'w-40';
}
