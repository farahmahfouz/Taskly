import { Component, DestroyRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { ProjectService } from '../../project.service';
import { CreateProjectPayload } from '../../project.model';
import { ToastService } from '../../../../core/services/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { VerifiedIconComponent } from '../../../../shared/icons/verified-icon.component';
import { ErrorIconComponent } from '../../../../shared/icons/error-icon.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    TextareaComponent,
    InputComponent,
    ReactiveFormsModule,
    VerifiedIconComponent,
    ErrorIconComponent,
    AsyncPipe,
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css',
})
export class ProjectFormComponent {
  mode: 'add' | 'edit' = this.route.snapshot.paramMap.has('id') ? 'edit' : 'add';
  projectId: string | null = null;
  isLoading = false;

  pageTitle$ = this.route.title;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private toast: ToastService,
    private destroyRef: DestroyRef,
  ) {}

  projectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
  });

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.mode = this.projectId ? 'edit' : 'add';

    if (this.mode === 'edit' && this.projectId) {
      this.projectService.getProjectById(this.projectId).subscribe(project => {
        this.projectForm.patchValue(project);
      });
    }
  }

  onSubmit() {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const request =
      this.mode === 'edit' && this.projectId
        ? this.projectService.updateProject(this.projectId, this.projectForm.value)
        : this.projectService.createProject(this.projectForm.value as CreateProjectPayload);

    request
      .pipe(takeUntilDestroyed(this.destroyRef))

      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toast.showSuccess(
            this.mode === 'add' ? 'Project created successfully' : 'Project updated successfully',
          );
          this.router.navigate(['/project']);
        },
        error: (err: any) => {
          this.isLoading = false;

          this.toast.showError(
            err.error?.message ||
              (this.mode === 'add' ? 'Failed to create project' : 'Failed to update project'),
          );
        },
      });
  }

  onCancel() {
    this.router.navigate(['/project']);
  }
}

export const projectFormTitleResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot,
): string => {
  return route.paramMap.has('id') ? 'Edit Project' : 'Add New Project';
};
