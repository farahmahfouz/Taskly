import { NgIf } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ShowPasswordComponent } from '../../icons';
import { HidePasswordComponent } from '../../icons/hide-password.component';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [NgIf, ShowPasswordComponent, HidePasswordComponent],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './control.component.html',
  styleUrl: './control.component.css',
})
export class ControlComponent {
  @Input({ required: true }) label!: string;
  @Input() optional = false;
  @Input() errorMessage = '';
  @Input() isPassword = false;

  isVisible = false; 

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

  get hasError(): boolean {
    return !!this.errorMessage;
  }
}
