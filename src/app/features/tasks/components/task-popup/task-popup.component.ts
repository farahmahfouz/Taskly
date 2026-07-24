import { Component, effect, EventEmitter, input, Input, Output, signal } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { CopyLinkIconComponent } from '../../../../shared/icons';
import { TasksService } from '../../tasks.service';
import { Task } from '../../task.constants';
import { DatePipe } from '@angular/common';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';

@Component({
  selector: 'app-task-popup',
  standalone: true,
  imports: [ModalComponent, CopyLinkIconComponent, DatePipe, InitialsPipe],
  templateUrl: './task-popup.component.html',
  styleUrl: './task-popup.component.css',
})
export class TaskPopupComponent {
  @Input() isOpen = true;
  @Output() close = new EventEmitter<void>();

  task = signal<Task | null>(null);

  projectId = input.required<string>();
  taskId = input.required<string>();

  constructor(private taskService: TasksService) {
    effect(() => {
      const projectId = this.projectId();
      const taskId = this.taskId();

      this.taskService.getTask(projectId, taskId).subscribe({
        next: res => {
          console.log(res);
           this.task.set(res[0]);
        },
      });
    });
  }
}
