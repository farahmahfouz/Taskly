import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormLayoutComponent } from '../../../shared/components/form-layout/form-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest } from './login';
import { AuthService } from '../auth.service';
import { STORAGE_KEYS } from '../../../core/utils/constants';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormLayoutComponent, RouterLink, ReactiveFormsModule, InputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  errorMessage = '';
  serverError = ''
  isLoading = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
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
        storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.access_token);
        storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.refresh_token);

        if (rememberMe) {
          const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
          localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRY, expiry.toString());
        } else {
          localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRY);
        }
        
        this.authService.getUser().subscribe(() => {
          this.router.navigate(['/project']);
        });
      },
      error: err => {
        this.isLoading = false;
        if (err.error?.error_code === 'invalid_credentials') {
          this.serverError = 'Invalid email or password';
        }
      },
    });
  }
}
