import { Component, HostListener } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FormLayoutComponent } from '../../../shared/components/form-layout/form-layout.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormLayoutComponent, InputComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  isMobile = window.innerWidth < 768;

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }
}
