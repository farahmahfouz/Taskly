import { Component, forwardRef, Input, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HidePasswordIconComponent, ShowPasswordIconComponent } from '../../icons';
import { ErrorIconComponent } from "../../icons/error-icon.component";

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ShowPasswordIconComponent, HidePasswordIconComponent, ErrorIconComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input({ required: true }) label!: string;
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() optional = false;
  @Input() errorMessage = '';
  @Input() serverError = '';
  @Input() showPasswordToggle = false;
  @Input() hint = '';
  @Input() required = false;

  value = '';

  disabled = false;

  isVisible = false;

  get inputType() {
    if (this.type !== 'password') return this.type;

    return this.isVisible ? 'text' : 'password';
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

  onChange = (_: string) => {};

  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  updateValue(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.value = value;

    this.onChange(value);
    this.onTouched();
  }
}
