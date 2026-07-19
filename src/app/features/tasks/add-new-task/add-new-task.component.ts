import { Component, DestroyRef } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { Member } from '../../members/members.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from '../../members/members.service';
import { TextareaComponent } from '../../../shared/components/textarea/textarea.component';
import { EpicsService } from '../../epics/epics.service';
import { Epic } from '../../epics/epic.model';
import { SlicePipe } from '@angular/common';
import { getControlError } from '../../../core/utils/form-error.util';
import { CreateTaskRequest, TASK_STATUS, TaskStatus } from '../task.constants';
import { TasksService } from '../tasks.service';
import { ToastService } from '../../../core/services/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add-new-task',
  standalone: true,
  imports: [InputComponent, TextareaComponent, ReactiveFormsModule, SlicePipe],
  templateUrl: './add-new-task.component.html',
  styleUrl: './add-new-task.component.css',
})
export class AddNewTaskComponent {
  members: Member[] = [];
  epics: Epic[] = [];
  projectId = '';
  isLoading = false;
  errorMessage = '';
  status = TASK_STATUS;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private membersService: MembersService,
    private epicsService: EpicsService,
    private tasksService: TasksService,
    private toaster: ToastService,
    private destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id')!;

    this.taskForm.patchValue({
      project_id: this.projectId,
    });

    this.loadMembers();
    this.loadEpics();
  }

  taskForm = this.fb.group({
    project_id: ['', Validators.required],
    title: ['', Validators.required],
    epic_id: [''],
    description: [''],
    assignee_id: [''],
    due_date: [''],
    status: ['TO_DO'],
  });

  getError(controlName: string): string {
    return getControlError(this.taskForm.get(controlName));
  }

  private loadMembers(): void {
    this.membersService
      .getProjectMembers(this.projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: members => {
          this.members = members;
        },
      });
  }

  private loadEpics(): void {
    this.epicsService
      .getAllProjectEpics(this.projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.epics = res.body ?? [];

          const epicId = this.route.snapshot.queryParamMap.get('epicId');

          if (epicId) {
            this.taskForm.patchValue({
              epic_id: epicId,
            });
          }
        },
      });
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const body: CreateTaskRequest = {
      project_id: this.projectId,
      title: this.taskForm.value.title!,
      epic_id: this.taskForm.value.epic_id || '',
      description: this.taskForm.value.description || '',
      assignee_id: this.taskForm.value.assignee_id || '',
      due_date: this.taskForm.value.due_date || '',
      status: this.taskForm.value.status as TaskStatus,
    };

    this.tasksService
      .createTask(body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.toaster.showSuccess('Tasks created sucessfully.');
        },
        error: err => {
          this.isLoading = false;
        },
      });
  }
}
