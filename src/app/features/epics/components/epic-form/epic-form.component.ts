import { Component, HostListener } from '@angular/core';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { futureValidator } from '../../../../core/utils/futureValidator';
import { getControlError } from '../../../../core/utils/form-error.util';

@Component({
  selector: 'app-epic-form',
  standalone: true,
  imports: [TextareaComponent, InputComponent, ReactiveFormsModule],
  templateUrl: './epic-form.component.html',
  styleUrl: './epic-form.component.css',
})
export class EpicFormComponent {
  isDesktop = window.innerWidth >= 768;
  today = new Date().toISOString().split('T')[0];
  errorMessage = '';

  @HostListener('window:resize')
  onResize() {
    this.isDesktop = window.innerWidth >= 768;
  }

  constructor(private fb: FormBuilder) {}

  epicForm = this.fb.group({
    title: ['', Validators.required, Validators.minLength(3)],
    description: ['', [Validators.maxLength(500)]],
    assignee: [''],
    deadline: ['', futureValidator],
  });

  getError(controlName: string): string {
    if (this.epicForm.get('deadline')?.hasError('future')) {
      return 'Deadline must be today or a future date.';
    }
    return getControlError(this.epicForm.get(controlName));
  }

  onSubmit() {
    if (this.epicForm.invalid) {
      this.epicForm.markAllAsTouched();
      return;
    }
    console.log('first');
  }
}
