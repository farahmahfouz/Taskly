import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormLayoutComponent } from '../../../shared/components/form-layout/form-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest } from './login';
import { AuthService } from '../auth.service';
import { InputComponent } from '../../../shared/components/input/input.component';
import { getControlError } from '../../../core/utils/form-error.util';

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
  serverError = '';
  isLoading = false;

  loginForm = new FormGroup({
    email: new FormControl('test666@gmail.com', [Validators.required, Validators.email]),
    password: new FormControl('Password123!', [Validators.required]),
    rememberMe: new FormControl(false),
  });

  getError(controlName: string): string {
    return getControlError(this.loginForm.get(controlName));
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;

    const rememberMe = this.loginForm.value.rememberMe;

    const body: LoginRequest = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    };

    this.authService.login(body, !!rememberMe).subscribe({
      next: () => {
        this.isLoading = false;
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
