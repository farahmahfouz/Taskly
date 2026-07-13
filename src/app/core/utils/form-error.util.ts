import { AbstractControl } from '@angular/forms';

export function getControlError(ctrl: AbstractControl | null | undefined): string {
  if (!ctrl?.touched || !ctrl.errors) return '';

  const messages: Record<string, string> = {
    required: 'This field is required',
    email: 'Please enter a valid email',
    minlength: `Minimum length is ${ctrl.errors['minlength']?.requiredLength}`,
    maxlength: `Maximum length is ${ctrl.errors['maxlength']?.requiredLength}`,
    uppercase: 'Password must contain an uppercase letter',
    lowercase: 'Password must contain a lowercase letter',
    digit: 'Password must contain a number',
    special: 'Password must contain a special character',
    whitespace: 'Password must not contain spaces',
  };

  const errorKey = Object.keys(ctrl.errors)[0];
  return messages[errorKey] ?? '';
}
