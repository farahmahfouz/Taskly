import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  const errors: ValidationErrors = {};

  if (!/[A-Z]/.test(value)) errors['uppercase'] = true;
  if (!/[a-z]/.test(value)) errors['lowercase'] = true;
  if (!/\d/.test(value)) errors['digit'] = true;
  if (!/[^A-Za-z0-9]/.test(value)) errors['special'] = true;
  if (/\s/.test(value)) errors['whitespace'] = true;

  return Object.keys(errors).length ? errors : null;
}

export function isMatchPw(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { notMatch: true };
}
