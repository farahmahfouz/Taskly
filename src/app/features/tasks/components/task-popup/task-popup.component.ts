import { Component, effect, EventEmitter, input, Input, Output } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea.component';
import { CopyLinkIconComponent } from '../../../../shared/icons';
import { TasksService } from '../../tasks.service';

@Component({
  selector: 'app-task-popup',
  standalone: true,
  imports: [ModalComponent, TextareaComponent, CopyLinkIconComponent],
  templateUrl: './task-popup.component.html',
  styleUrl: './task-popup.component.css',
})
export class TaskPopupComponent {
  @Input() isOpen = true;
  @Output() close = new EventEmitter<void>();

  projectId = input.required<string>();
  taskId = input.required<string>();

  constructor(private taskService: TasksService) {
    effect(() => {
      const projectId = this.projectId();
      const taskId = this.taskId();

      this.taskService.getTask(projectId, taskId).subscribe({
        next: res => {
          console.log(res);
        },
      });
    });
  }
}
