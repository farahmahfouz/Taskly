import { Component, DestroyRef, effect, input, signal } from '@angular/core';
import { TasksService } from '../../tasks.service';
import { ProjectContextService } from '../../../../core/services/project-context.service';
import { Task } from '../../task.constants';
import { DatePipe } from '@angular/common';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { RouterLink } from '@angular/router';
import { OpenPopupService } from '../../../../core/services/open-popup.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaginationBase } from '../../../../shared/classes/pagination.base';
import { HttpResponse } from '@angular/common/http';
import { InfinteScrollDirective } from '../../../../shared/directives/infinte-scroll.directive';
import { ToastService } from '../../../../core/services/toast.service';
import { IconComponent } from '../../../../shared/icons/icon.component';

const DRAG_DATA_KEY = 'application/json';

@Component({
  selector: 'app-tasks-board-view',
  standalone: true,
  imports: [
    DatePipe,
    InitialsPipe,
    RouterLink,
    InfinteScrollDirective,
    IconComponent
  ],
  templateUrl: './tasks-board-view.component.html',
  styleUrl: './tasks-board-view.component.css',
})
export class TasksBoardViewComponent extends PaginationBase {
  status = input.required<any>();

  tasks: Task[] = [];
  projectId = '';
  search = input<string>('');

  constructor(
    private tasksService: TasksService,
    private projectContext: ProjectContextService,
    private openPopupService: OpenPopupService,
    private destroyRef: DestroyRef,
    private toast: ToastService
  ) {
    super();
    effect(() => {
      const projectId = this.projectContext.activeProjectId();
      this.search();

      if (!projectId) return;
      this.projectId = projectId;

      this.currentPage = 1;
      this.loadPage(false);
    });

    effect(() => {
      const updatedTask = this.openPopupService.task();
      if (!updatedTask) return;

      const belongsToThisColumn = updatedTask.status === this.status().value;
      const existsInList = this.tasks.some(t => t.id === updatedTask.id);

      if (!belongsToThisColumn && existsInList) {
        this.tasks = this.tasks.filter(t => t.id !== updatedTask.id);
        return;
      }

      if (belongsToThisColumn) {
        this.tasks = existsInList
          ? this.tasks.map(t => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t))
          : [updatedTask, ...this.tasks];
      }
    });
  }

  protected loadPage(loadMore: boolean) {
    if (loadMore) {
      this.isLoadingMore = true;
    } else if (!this.isFirstLoading) {
      this.isLoading = true;
    }

    this.isError = false;

    this.tasksService
      .getTasksByStatus(this.projectId, this.status().value, this.limit, this.offset, this.search())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: HttpResponse<Task[]>) => {
          const newTasks = res.body ?? [];

          this.tasks = loadMore ? [...this.tasks, ...newTasks] : newTasks;

          const contentRange = res.headers.get('Content-Range');

          this.totalCount = Number(contentRange?.split('/')[1] ?? 0);
          this.totalPages = Math.ceil(this.totalCount / this.limit);

          this.isLoading = false;
          this.isLoadingMore = false;
          this.isError = false;
        },
        error: () => {
          this.isLoading = false;
          this.isLoadingMore = false;
          this.isError = true;
        },
      });
  }

  onRowClick(task: Task) {
    this.openPopupService.open(task.id);
  }

  onDragStart(event: DragEvent, task: Task) {
    if (!event.dataTransfer) return;

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData(DRAG_DATA_KEY, JSON.stringify(task));
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDragLeave(event: DragEvent) {
    const related = event.relatedTarget as HTMLElement | null;
    const current = event.currentTarget as HTMLElement;
    if (related && current.contains(related)) return;

  }

  onDrop(event: DragEvent) {
    event.preventDefault();

    const raw = event.dataTransfer?.getData(DRAG_DATA_KEY);
    if (!raw) return;

    let draggedTask: Task;
    try {
      draggedTask = JSON.parse(raw);
    } catch {
      return;
    }

    const newStatus = this.status().value;
    const originalStatus = draggedTask.status;

    if (originalStatus === newStatus) return;

    const originalTask = { ...draggedTask };
    const optimisticTask = { ...draggedTask, status: newStatus };

    this.openPopupService.setTask(optimisticTask);

    this.tasksService
      .updateTask(draggedTask.id, { status: newStatus })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
        },
        error: () => {
          this.openPopupService.setTask(originalTask);
          this.toast.showError('Something went wrong please try again!');
        },
      });
  }
}
