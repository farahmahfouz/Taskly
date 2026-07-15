import { Component, HostListener, OnInit } from '@angular/core';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { futureValidator } from '../../../../core/utils/futureValidator';
import { getControlError } from '../../../../core/utils/form-error.util';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CreateEpicRequest } from '../../epic.model';
import { EpicsService } from '../../epics.service';
import { MembersService } from '../../../members/members.service';
import { Member } from './../../../members/members.model';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-epic-form',
  standalone: true,
  imports: [TextareaComponent, InputComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './epic-form.component.html',
  styleUrl: './epic-form.component.css',
})
export class EpicFormComponent implements OnInit {
  isDesktop = window.innerWidth >= 768;
  today = new Date().toISOString().split('T')[0];
  errorMessage = '';
  projectId = '';
  projectName = '';
  isLoading = false;
  members: Member[] = [];

  @HostListener('window:resize')
  onResize() {
    this.isDesktop = window.innerWidth >= 768;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private epicsService: EpicsService,
    private membersService: MembersService,
    private toaster: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const project = this.route.snapshot.data['project'];
    this.projectName = project?.name ?? '';

    this.projectId = this.route.snapshot.paramMap.get('id')!;
    this.membersService.getProjectMembers(this.projectId).subscribe({
      next: members => {
        this.members = members;
      },
      error: err => {
        console.log(err);
      },
    });
  }

  epicForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
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

    this.isLoading = true;

    const body: CreateEpicRequest = {
      title: this.epicForm.value.title!,
      description: this.epicForm.value.description || '',
      assignee_id: this.epicForm.value.assignee || '',
      project_id: this.projectId,
      deadline: this.epicForm.value.deadline || '',
    };

    this.epicsService.createNewEpic(body).subscribe({
      next: res => {
        this.isLoading = false;
        this.toaster.showSuccess('Epic created Successfully');
        this.router.navigate(['/project', this.projectId, 'epics']);
      },
      error: err => {
        this.isLoading = false;
         this.toaster.showError('Failed to create epic.')
      },
    });
  }
}
