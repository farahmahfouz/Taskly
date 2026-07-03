import { Component, Input } from '@angular/core';

export interface PasswordHint {
  label: string;
  valid: boolean;
}
@Component({
  selector: 'app-password-hints',
  standalone: true,
  imports: [],
  templateUrl: './password-hints.component.html',
  styleUrl: './password-hints.component.css'
})
export class PasswordHintsComponent {
  @Input({ required: true }) hints!: PasswordHint[];
  @Input() title!: string;
  @Input() backgroundClass = 'bg-[#e8edff]'
}
