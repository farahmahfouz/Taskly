import { Component } from '@angular/core';
import { FormLayoutComponent } from '../../shared/components/form-layout/form-layout.component';
import { ControlComponent } from '../../shared/components/control/control.component';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest } from './login';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormLayoutComponent, ControlComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  errorMessage = '';
  isLoading = false;

  loginForm = new FormGroup({
    email: new FormControl('test666@gmail.com', [Validators.required, Validators.email]),
    password: new FormControl('Password123!', [Validators.required]),
    rememberMe: new FormControl(false),
  });

  getError(controlName: string): string {
    const ctrl = this.loginForm.get(controlName);

    if (!ctrl?.touched || !ctrl.errors) {
      return '';
    }

    if (ctrl.errors['required']) {
      return `${controlName} is required`;
    }

    if (ctrl.errors['email']) {
      return 'Please enter a valid email';
    }
    return '';
  }

  login() {
    if (this.loginForm.invalid) return;
    const rememberMe = this.loginForm.value.rememberMe;

    const body: LoginRequest = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    };

    this.authService.login(body).subscribe({
      next: res => {
        this.isLoading = true;
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('access_token', res.access_token);
        storage.setItem('refresh_token', res.refresh_token);

        if (rememberMe) {
          const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
          localStorage.setItem('session_expiry', String(expiry));
        }
        this.authService.getUser().subscribe(() => {
          this.router.navigate(['/project']);
        });
      },
      error: err => {
        this.isLoading = false;
        if (err.error?.error_code === 'invalid_credentials') {
          this.errorMessage = 'Invalid email or password';
        }
      },
    });
  }
}
