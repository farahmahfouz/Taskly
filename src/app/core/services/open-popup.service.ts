import { DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { ProjectContextService } from './project-context.service';
import { TasksService } from '../../features/tasks/tasks.service';
import { Task } from '../../features/tasks/task.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class OpenPopupService {
  private tasksService = inject(TasksService);
  private projectContext = inject(ProjectContextService);
  private destroyRef = inject(DestroyRef);

  isOpen = signal(false);
  selectedTaskId = signal<string | null>(null);

  task = signal<Task | null>(null);
  isLoading = signal(false);
  hasError = signal(false);

  constructor() {
    effect(
      () => {
        const taskId = this.selectedTaskId();
        const projectId = this.projectContext.activeProjectId();

        if (!taskId || !projectId) {
          this.task.set(null);
          this.isLoading.set(false);
          this.hasError.set(false);
          return;
        }

        this.fetchTask(projectId, taskId);
      },
      { allowSignalWrites: true },
    );
  }

  open(taskId: string) {
    this.selectedTaskId.set(taskId);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.selectedTaskId.set(null);
  }

  private fetchTask(projectId: string, taskId: string) {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.task.set(null);

    this.tasksService
      .getTask(projectId, taskId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => {
          this.task.set(res?.[0] ?? null);
          this.isLoading.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.isLoading.set(false);
        },
      });
  }
}
