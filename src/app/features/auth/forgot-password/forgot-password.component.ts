import { Component, HostListener, OnDestroy } from '@angular/core';
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
import { Subscription, timer } from 'rxjs';
import { RouterLink } from '@angular/router';

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
    RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnDestroy {
  constructor(private authService: AuthService) {}

  isMobile = window.innerWidth < 768;
  isLoading = false;
  showSuccess = false;
  serverError = '';

  remainingSeconds = 300;
  resendDisabled = true;

  resendTrials = 3;

  private timerSubscription?: Subscription;

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  get emailError(): string {
    const email = this.forgotPasswordForm.get('email');

    if (!email?.touched) return '';

    if (email.hasError('required')) {
      return 'Email is required';
    }

    if (email.hasError('email')) {
      return 'Please enter a valid email address';
    }

    return '';
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.serverError = '';
    this.showSuccess = false;
    this.isLoading = true;

    this.authService.forgotPassword(this.forgotPasswordForm.value.email!).subscribe({
      next: () => {
        this.showSuccess = true;
        this.isLoading = false;
        this.startTimer();
      },
      error: err => {
        this.isLoading = false;

        if (err.status === 404) {
          this.showSuccess = true;
          this.startTimer();
        } else {
          this.serverError = 'Something went wrong. Please try again.';
        }
      },
    });
  }

  startTimer() {
    this.remainingSeconds = 300;
    this.resendDisabled = true;

    this.timerSubscription?.unsubscribe();

    this.timerSubscription = timer(1000, 1000).subscribe(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
      }

      if (this.remainingSeconds === 0) {
        this.resendDisabled = false;
        this.timerSubscription?.unsubscribe();
      }
    });
  }

  resend() {
    if (this.resendDisabled || this.resendTrials === 0) {
      return;
    }

    this.resendTrials--;

    this.serverError = '';

    this.authService.forgotPassword(this.forgotPasswordForm.value.email!).subscribe({
      next: () => {
        this.startTimer();
      },
      error: () => {
        this.serverError = 'Something went wrong. Please try again.';
      },
    });
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }
}
