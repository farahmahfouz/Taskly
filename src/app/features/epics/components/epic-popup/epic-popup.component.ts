import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
  OnInit,
  DestroyRef,
  input,
  effect,
} from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import {
  CloseIconComponent,
  DateIconComponent,
  EpicColumnsIconComponent,
  TaskListIconComponent,
} from '../../../../shared/icons';
import { EpicsService } from '../../epics.service';
import { Epic } from '../../epic.model';
import { DatePipe } from '@angular/common';
import { MembersService } from '../../../members/members.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Member } from '../../../members/members.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { futureValidator } from '../../../../core/utils/futureValidator';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TasksService } from '../../../tasks/tasks.service';
import { Task } from '../../../tasks/task.constants';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { EpicTasksSectionComponent } from "./epic-tasks-section/epic-tasks-section.component";
import { EpicTasksSkeletonComponent } from "./epic-tasks-skeleton/epic-tasks-skeleton.component";
import { EpicTasksEmptyComponent } from "./epic-tasks-empty/epic-tasks-empty.component";
import { EpicTasksErrorComponent } from "./epic-tasks-error/epic-tasks-error.component";
import { TaskPopupComponent } from "../../../tasks/components/task-popup/task-popup.component";
import { OpenPopupService } from '../../../../core/services/open-popup.service';

@Component({
  selector: 'app-epic-popup',
  standalone: true,
  imports: [
    ModalComponent,
    CloseIconComponent,
    DateIconComponent,
    EpicColumnsIconComponent,
    DatePipe,
    ReactiveFormsModule,
    InitialsPipe,
    EpicTasksSectionComponent,
    EpicTasksSkeletonComponent,
    EpicTasksEmptyComponent,
    EpicTasksErrorComponent,
    TaskPopupComponent
],
  templateUrl: './epic-popup.component.html',
  styleUrl: './epic-popup.component.css',
})
export class EpicPopupComponent implements OnInit {
  @Input() isOpen = false;
  projectId = input.required<string>();
  epicId = input<string>();

  @Output() close = new EventEmitter<void>();

  epic?: Epic;
  members: Member[] = [];
  isEditingAssignee = false;
  tasks: Task[] = [];
  isLoading = false;
  errorMsg = false;

  constructor(
    private fb: FormBuilder,
    private epicsService: EpicsService,
    private membersService: MembersService,
    private toaster: ToastService,
    private router: Router,
    private destroyRef: DestroyRef,
    private tasksService: TasksService,
    public openPopupService: OpenPopupService
  ) {
    effect(() => {
      const id = this.epicId();
      const projectId = this.projectId();
      if (id && projectId) {
        this.loadEpic(projectId, id);
        this.loadTasks(id);
      }
    });
  }

  epicForm = this.fb.group({
    title: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'blur',
      },
    ],
    description: [
      '',
      {
        updateOn: 'blur',
      },
    ],
    assignee: [''],
    deadline: ['', futureValidator],
  });

  ngOnInit(): void {
    this.loadMembers();
  }

  updateAssignee() {
    const previousValue = this.epicForm.get('assignee')?.value ?? '';
    const member = this.members.find(m => m.user_id === previousValue);
    const createdBy = this.epic?.created_by;

    this.epicsService
      .updateEpic(this.epic!.id, {
        assignee_id: this.epicForm.value.assignee || null,
      })
      .subscribe({
        next: updated => {
          this.epic = {
            ...this.epic,
            ...updated[0],
            created_by: createdBy ?? {
              sub: '',
              name: '',
              email: '',
              department: '',
            },
            assignee: member
              ? {
                  sub: member.user_id,
                  name: member.metadata.name,
                  email: member.metadata.email,
                  department: member.metadata.department,
                }
              : null,
          };
          this.epicsService.updateEpicInStore(this.epic);
        },
        error: () => {
          this.epicForm.patchValue({ assignee: previousValue });
          this.toaster.showError('Failed to update epic. Please try again.');
        },
      });
  }

  updateField(field: 'title' | 'description' | 'deadline') {
    const previousValue = this.epicForm.get(field)?.value ?? '';
    const createdBy = this.epic?.created_by;

    this.epicsService
      .updateEpic(this.epic!.id, {
        [field]: this.epicForm.value[field] || null,
      })
      .subscribe({
        next: updated => {
          this.epic = {
            ...this.epic,
            ...updated[0],
            created_by: createdBy ?? {
              sub: '',
              name: '',
              email: '',
              department: '',
            },
          };
        },
        error: () => {
          this.epicForm.patchValue({ [field]: previousValue });
          this.toaster.showError('Failed to update epic. Please try again.');
        },
      });
  }

  goToTasks() {
    this.router.navigate(['/project', this.projectId(), 'tasks', 'new'], {
      queryParams: {
        epicId: this.epic?.id,
      },
    });
  }

  loadTasks(epicId: string) {
    this.isLoading = true;
    this.errorMsg = false;
    this.tasksService
      .getAllTasks(epicId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.errorMsg = false;
          this.tasks = res;
          this.isLoading = false;
        },
        error: err => {
          this.isLoading = false;
          this.errorMsg = true;
        },
      });
  }

  private loadMembers() {
    this.membersService
      .getProjectMembers(this.projectId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: members => {
          this.members = members;
        },
      });
  }

  private loadEpic(projectId: string, epicId: string) {
    this.epicsService
      .getProjectEpiById(projectId, epicId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.epic = res[0];
        this.epicForm.patchValue({
          title: this.epic.title,
          description: this.epic.description,
          assignee: this.epic.assignee?.sub ?? '',
          deadline: this.epic.deadline,
        });
      });
  }
}
