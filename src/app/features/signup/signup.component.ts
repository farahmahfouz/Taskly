import { Component } from '@angular/core';
import { passwordValidator, isMatchPw } from '../../core/utils/password.validator';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ControlComponent } from '../../shared/components/control/control.component';
import { FormLayoutComponent } from '../../shared/components/form-layout/form-layout.component';
import { PasswordHintsComponent } from '../../shared/components/password-hints/password-hints.component';
import { SignUpRequest } from './signup';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ControlComponent, ReactiveFormsModule, FormLayoutComponent, PasswordHintsComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  constructor(private authService: AuthService, private router: Router) {}
  form = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^(?!.*\s{2,})[\p{L}]+(?:\s[\p{L}]+)*$/u),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      job_title: new FormControl(''),
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
      { label: 'At least 8 characters', valid: password.length >= 8 },
      {
        label: 'One uppercase, lowercase, and digit',
        valid: /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(password),
      },
      { label: 'One special character', valid: /[^A-Za-z0-9]/.test(password) },
    ];
  }

  getError(controlName: string): string {
    const ctrl = this.form.get(controlName);

    if (!ctrl?.touched) {
      return '';
    }

    if (controlName === 'confirmPassword' && this.form.hasError('notMatch')) {
      return 'Passwords do not match';
    }

    if (!ctrl.errors) {
      return '';
    }

    if (ctrl.errors['required']) {
      return `${controlName} is required`;
    }

    if (ctrl.errors['email']) {
      return 'Please enter a valid email';
    }

    if (ctrl.errors['minlength']) {
      return `Minimum length is ${ctrl.errors['minlength'].requiredLength}`;
    }

    if (ctrl.errors['maxlength']) {
      return `Maximum length is ${ctrl.errors['maxlength'].requiredLength}`;
    }

    if (ctrl.errors['uppercase']) {
      return 'Password must contain an uppercase letter';
    }

    if (ctrl.errors['lowercase']) {
      return 'Password must contain a lowercase letter';
    }

    if (ctrl.errors['digit']) {
      return 'Password must contain a number';
    }

    if (ctrl.errors['special']) {
      return 'Password must contain a special character';
    }

    if (ctrl.errors['whitespace']) {
      return 'Password must not contain spaces';
    }

    return '';
  }
  onSubmit() {
    if (this.form.invalid) return;

    const body: SignUpRequest = {
      email: this.form.value.email!,
      password: this.form.value.password!,
      data: {
        name: this.form.value.name!,
        job_title: this.form.value.job_title!,
      },
    };

    this.authService.signUp(body).subscribe({
      next: res => {
        this.router.navigate(['/project'])
      },
      error: err => {
        console.log(err.error.message);
      },
    });
  }
}
