import { AbstractControl, ValidationErrors } from "@angular/forms";

export const futureValidator = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;

  const value = new Date(control.value);
  value.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (value >= today) {
    return null;
  }

  return {
    future: true,
  };
};