import {
  Component,
  computed,
  DestroyRef,
  effect,
  EventEmitter,
  HostListener,
  Input,
  Output,
  signal,
} from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { TASK_STATUS_BADGE_STYLES } from '../../task.constants';
import { DatePipe, NgClass } from '@angular/common';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { OpenPopupService } from '../../../../core/services/open-popup.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TasksService } from '../../tasks.service';
import { ToastService } from '../../../../core/services/toast.service';
import { MembersService } from '../../../members/members.service';
import { Member } from '../../../members/members.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProjectContextService } from '../../../../core/services/project-context.service';
import { EpicsService } from '../../../epics/epics.service';
import { Epic } from '../../../epics/epic.model';
import { IconComponent } from '../../../../shared/icons/icon.component';

@Component({
  selector: 'app-task-popup',
  standalone: true,
  imports: [ModalComponent, IconComponent, DatePipe, InitialsPipe, NgClass, ReactiveFormsModule],
  templateUrl: './task-popup.component.html',
  styleUrl: './task-popup.component.css',
})
export class TaskPopupComponent {
  @Input() isOpen = true;
  @Output() close = new EventEmitter<void>();

  isLoading = signal(false);
  hasError = signal(false);

  members: Member[] = [];
  epics: Epic[] = [];

  isEditingAssignee = false;
  isEditingStatus = false;
  isEditingEpic = false;

  constructor(
    public openPopupService: OpenPopupService,
    private fb: FormBuilder,
    private tasksService: TasksService,
    private toaster: ToastService,
    private membersService: MembersService,
    private destroyRef: DestroyRef,
    private projectContextService: ProjectContextService,
    private epicsService: EpicsService,
  ) {
    effect(() => {
      const task = this.openPopupService.task();
      if (task) {
        this.taskForm.patchValue(
          {
            title: task.title,
            description: task.description,
            assignee: task.assignee?.id ?? '',
            epic: task.epic_id ?? '',
            status: task.status,
            dueDate: task.due_date ? task.due_date.substring(0, 10) : '',
          },
          { emitEvent: false },
        );
      }
    });

    effect(() => {
      const projectId = this.projectContextService.activeProjectId();
      if (projectId) {
        this.loadMembers();
        this.loadEpics();
      }
    });
  }

  readonly statusStyles = TASK_STATUS_BADGE_STYLES;
  readonly statusOptions = Object.keys(this.statusStyles);

  statusBadgeClass = computed(() => {
    const status = this.openPopupService.task()?.status;
    return status ? this.statusStyles[status] : this.statusStyles['TO_DO'];
  });

  @HostListener('window:keydown.escape', ['$event'])
  handleEscapeKey(event: Event) {
    this.openPopupService.close();
  }

  taskForm = this.fb.group({
    title: ['', { validators: [Validators.required], updateOn: 'blur' }],
    description: ['', { updateOn: 'blur' }],
    assignee: [''],
    epic: [''],
    status: [''],
    dueDate: [''],
  });

  updateTitle() {
    this.updateField('title', 'title', this.openPopupService.task()?.title ?? '');
  }

  updateDescription() {
    this.updateField('description', 'description', this.openPopupService.task()?.description ?? '');
  }

  updateStatus() {
    this.isEditingStatus = false;
    this.updateField('status', 'status', this.openPopupService.task()?.status ?? '');
  }

  updateDueDate() {
    const dueDate = this.openPopupService.task()?.due_date;
    this.updateField('dueDate', 'due_date', dueDate ? dueDate.substring(0, 10) : '');
  }

  private updateField(formField: string, payloadKey: string, previousValue: string) {
    const task = this.openPopupService.task();
    if (!task) return;

    const control = this.taskForm.get(formField)!;
    const newValue = control.value ?? '';

    if (newValue === previousValue) return;

    if (control.invalid) {
      control.patchValue(previousValue, { emitEvent: false });
      this.toaster.showError('Please enter a valid value.');
      return;
    }

    this.tasksService.updateTask(task.id, { [payloadKey]: newValue }).subscribe({
      next: updated => {
        this.openPopupService.task.set({
          ...task,
          ...updated[0],
          assignee: task.assignee,
          created_by: task.created_by,
          epic: task.epic,
        });
      },
      error: () => {
        control.patchValue(previousValue, { emitEvent: false });
        this.toaster.showError('Failed to update task. Please try again.');
      },
    });
  }

  updateAssignee() {
    const task = this.openPopupService.task();
    if (!task) return;

    const previousValue = task.assignee?.id ?? '';
    const newValue = this.taskForm.get('assignee')?.value ?? '';
    this.isEditingAssignee = false;

    if (newValue === previousValue) return;

    const member = this.members.find(m => m.user_id === newValue);

    this.tasksService.updateTask(task.id, { assignee_id: newValue || null }).subscribe({
      next: () => {
        this.openPopupService.task.set({
          ...task,
          assignee: member
            ? {
                id: member.user_id,
                name: member.metadata.name,
                email: member.metadata.email,
                department: member.metadata.department,
              }
            : null,
        });
      },
      error: () => {
        this.taskForm.patchValue({ assignee: previousValue }, { emitEvent: false });
        this.toaster.showError('Failed to update task. Please try again.');
      },
    });
  }

  updateEpic() {
    const task = this.openPopupService.task();
    if (!task) return;

    const previousValue = task.epic_id ?? '';
    const newValue = this.taskForm.get('epic')?.value ?? '';
    this.isEditingEpic = false;

    if (newValue === previousValue) return;

    const epic = this.epics.find(e => e.id === newValue);

    this.tasksService.updateTask(task.id, { epic_id: newValue || null }).subscribe({
      next: () => {
        this.openPopupService.task.set({
          ...task,
          epic_id: newValue,
          epic: epic!,
        });
      },
      error: () => {
        this.taskForm.patchValue({ epic: previousValue }, { emitEvent: false });
        this.toaster.showError('Failed to update task. Please try again.');
      },
    });
  }

  private loadEpics() {
    const projectId = this.projectContextService.activeProjectId()!;
    this.epicsService
      .getAllProjectEpics(projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.epics = response.body ?? [];
        },
      });
  }

  private loadMembers() {
    const projectId = this.projectContextService.activeProjectId()!;
    this.membersService
      .getProjectMembers(projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: members => {
          this.members = members;
        },
      });
  }

  copyURL() {
    navigator.clipboard.writeText(window.location.href);
  }
}
