import { Component, HostListener } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FormLayoutComponent } from '../../../shared/components/form-layout/form-layout.component';
import {
  IconForgotPasswordComponent,
  ArrowBackIconComponent,
  ClockIconComponent,
  CheckCircleIconComponent,
} from '../../../shared/icons';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormLayoutComponent,
    InputComponent,
    IconForgotPasswordComponent,
    ArrowBackIconComponent,
    ClockIconComponent,
    CheckCircleIconComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  constructor(private authService: AuthService) {}

  isMobile = window.innerWidth < 768;
  isLoading = false;
  showSuccess = false;

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.authService.forgotPassword(this.forgotPasswordForm.value.email!).subscribe({
      next: () => {
        this.showSuccess = true;
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;

        if (err.status === 404) {
          this.showSuccess = true;
        }

        else {
          console.log(err)
        }
      },
    });
  }
}
