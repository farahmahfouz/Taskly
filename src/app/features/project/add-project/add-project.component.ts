import { Component } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { TextareaComponent } from '../../../shared/components/textarea/textarea.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VerifiedIconComponent } from "../../../shared/icons/verified-icon.component";
import { ErrorIconComponent } from "../../../shared/icons/error-icon.component";
import { IdeaIconComponent } from '../../../shared/icons/idea-icon.component';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [InputComponent, TextareaComponent, ReactiveFormsModule, VerifiedIconComponent, ErrorIconComponent, IdeaIconComponent],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css',
})
export class AddProjectComponent {
  projectForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
    });
  }

  get name() {
    return this.projectForm.get('name');
  }

  get description() {
    return this.projectForm.get('description');
  }

  onSubmit() {

    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;


    const payload = {
      name: this.projectForm.value.name.trim(),
      description: this.projectForm.value.description?.trim() || undefined,
    };

    console.log(payload);

  }

  onCancel() {
    this.projectForm.reset();
    this.router.navigate(['/project']);
  }
}
