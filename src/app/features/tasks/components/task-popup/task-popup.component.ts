import {
  Component,
  computed,
  effect,
  EventEmitter,
  HostListener,
  input,
  Input,
  Output,
  signal,
} from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { CopyLinkIconComponent } from '../../../../shared/icons';
import { TasksService } from '../../tasks.service';
import { Task, TASK_STATUSES } from '../../task.constants';
import { DatePipe } from '@angular/common';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { ArrowDownIconComponent } from '../../../../shared/icons/arrow-down-icon.component';
import { OpenPopupService } from '../../../../core/services/open-popup.service';

@Component({
  selector: 'app-task-popup',
  standalone: true,
  imports: [ModalComponent, CopyLinkIconComponent, DatePipe, InitialsPipe, ArrowDownIconComponent],
  templateUrl: './task-popup.component.html',
  styleUrl: './task-popup.component.css',
})
export class TaskPopupComponent {
  @Input() isOpen = true;
  @Output() close = new EventEmitter<void>();
  task = signal<Task | null>(null);

  projectId = input.required<string>();
  taskId = input.required<string>();

   statusConfig = computed(() => {
    const currentStatus = this.task()?.status;
    return (
      TASK_STATUSES.find(s => s.value === currentStatus) ?? TASK_STATUSES[0]
    );
  });

  constructor(
    private taskService: TasksService,
    public openPopupService: OpenPopupService,
  ) {
    effect(() => {
      const projectId = this.projectId();
      const taskId = this.taskId();

      this.taskService.getTask(projectId, taskId).subscribe({
        next: res => {
          this.task.set(res[0]);
        },
      });
    });
  }

  @HostListener('window:keydown.escape', ['$event'])
  handleEscapeKey(event: Event) {
    this.openPopupService.close();
  }
}
