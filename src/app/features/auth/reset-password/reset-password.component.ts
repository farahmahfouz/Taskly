import { Component } from '@angular/core';
import { FormLayoutComponent } from '../../../shared/components/form-layout/form-layout.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isMatchPw, passwordValidator } from '../../../core/utils/password.validator';
import { PasswordHintsComponent } from '../../../shared/components/password-hints/password-hints.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormLayoutComponent, InputComponent, PasswordHintsComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
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
}
