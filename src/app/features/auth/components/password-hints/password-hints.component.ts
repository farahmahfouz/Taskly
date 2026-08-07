import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconComponent } from '../../../../shared/icons/icon.component';

export interface PasswordHint {
  label: string;
  valid: boolean;
}
@Component({
  selector: 'app-password-hints',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './password-hints.component.html',
  styleUrl: './password-hints.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordHintsComponent {
  @Input({ required: true }) hints!: PasswordHint[];
  @Input() title!: string;
  @Input() backgroundClass = 'bg-[#e8edff]';
}
