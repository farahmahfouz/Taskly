import { Component, OnInit } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { TextareaComponent } from '../../../shared/components/textarea/textarea.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VerifiedIconComponent } from '../../../shared/icons/verified-icon.component';
import { ErrorIconComponent } from '../../../shared/icons/error-icon.component';
import { IdeaIconComponent } from '../../../shared/icons/idea-icon.component';
import { ProjectService } from '../project.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [
    InputComponent,
    TextareaComponent,
    ReactiveFormsModule,
    VerifiedIconComponent,
    ErrorIconComponent,
    IdeaIconComponent,
  ],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css',
})
export class EditProjectComponent implements OnInit {
  projectForm: FormGroup;
  isLoading = false;
  projectId!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private toast: ToastService,
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
    });
  }

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id')!;

    this.loadProject();
  }

  get name() {
    return this.projectForm.get('name');
  }

  get description() {
    return this.projectForm.get('description');
  }

  loadProject() {
    this.isLoading = true;

    this.projectService.getProjectById(this.projectId).subscribe({
      next: project => {
        this.projectForm.patchValue({
          name: project.name,
          description: project.description,
        });

        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        this.toast.showError(err.error?.message || 'Failed to load project');
        this.router.navigate(['/project']);
      },
    });
  }

  onSubmit() {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const payload = {
      name: this.projectForm.value.name,
      description: this.projectForm.value.description,
    };

    this.projectService.updateProject(this.projectId, payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.toast.showSuccess('Project updated successfully');
        this.router.navigate(['/project']);
      },
      error: err => {
        this.isLoading = false;
        this.toast.showError(err.error?.message || 'Failed to update project');
      },
    });
  }

  onCancel() {
    this.router.navigate(['/project']);
  }
}
