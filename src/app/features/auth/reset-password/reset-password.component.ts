import { Component, OnInit } from '@angular/core';
import { FormLayoutComponent } from '../../../shared/components/form-layout/form-layout.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isMatchPw, passwordValidator } from '../../../core/utils/password.validator';
import { PasswordHintsComponent } from '../components/password-hints/password-hints.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { getControlError } from '../../../core/utils/form-error.util';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormLayoutComponent,
    InputComponent,
    PasswordHintsComponent,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
  ) {}

  accessToken = '';
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  ngOnInit() {
    this.accessToken = this.route.snapshot.queryParamMap.get('token') ?? '';
  }

  form = new FormGroup(
    {
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
        passwordValidator,
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {
      validators: [isMatchPw],
    },
  );

  get hints() {
    const password = this.form.get('password')?.value ?? '';

    return [
      {
        label: '8–64 characters',
        valid: password.length >= 8 && password.length <= 64,
      },
      {
        label: 'Lowercase letter',
        valid: /[a-z]/.test(password),
      },
      {
        label: 'Uppercase letter',
        valid: /[A-Z]/.test(password),
      },
      {
        label: 'One digit',
        valid: /\d/.test(password),
      },
      {
        label: 'Special character',
        valid: /[^A-Za-z0-9]/.test(password),
      },
    ];
  }

  getError(controlName: string): string {
    if (controlName === 'confirmPassword' && this.form.hasError('notMatch')) {
      return 'Passwords do not match';
    }

    return getControlError(this.form.get(controlName));
  }

  onSubmit() {
    if (this.form.invalid || !this.accessToken) return;

    this.isLoading = true;
    this.authService.resetPassword(this.form.value.password!, this.accessToken).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Your password has been updated successfully. You can now log in.';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err.error?.message ?? 'Something went wrong. Please try again.';
      },
    });
  }
}
