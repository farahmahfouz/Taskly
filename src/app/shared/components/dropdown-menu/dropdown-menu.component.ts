import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LogoutIconComponent } from "../../icons/logout-icon.component";

export interface DropdownItem {
  label: string;
  icon?: string;
  danger?: boolean;
  action: () => void;
}

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [LogoutIconComponent],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuComponent {
  @Input() items: DropdownItem[] = [];
  @Input() top = 'top-8';
  @Input() width = 'w-40';
}
