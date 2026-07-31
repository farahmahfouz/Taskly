import { Component, DestroyRef, effect, input } from '@angular/core';
import { TasksService } from '../../tasks.service';
import { ProjectContextService } from '../../../../core/services/project-context.service';
import { Task, TASK_STATUS_BADGE_STYLES } from '../../task.constants';
import { CommonModule, DatePipe } from '@angular/common';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { EditIconComponent } from '../../../../shared/icons/edit-icon.component';
import { OpenPopupService } from '../../../../core/services/open-popup.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { PaginationBase } from '../../../../shared/classes/pagination.base';

@Component({
  selector: 'app-tasks-list-view',
  standalone: true,
  imports: [CommonModule, EditIconComponent, InitialsPipe, DatePipe, RouterLink, LoaderComponent],
  templateUrl: './tasks-list-view.component.html',
  styleUrl: './tasks-list-view.component.css',
})
export class TasksListViewComponent extends PaginationBase {
  readonly statusStyles = TASK_STATUS_BADGE_STYLES;
  tasks: Task[] = [];
  projectId = '';

  search = input<string>('');

  constructor(
    private tasksService: TasksService,
    private projectContext: ProjectContextService,
    private openPopupService: OpenPopupService,
    private destroyRef: DestroyRef,
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

      this.tasks = this.tasks.map(t =>
        t.id === updatedTask.id ? { ...t, ...updatedTask } : t,
      );
    });
  }

  protected loadPage(loadMore: boolean) {
    if (loadMore) {
      this.isLoadingMore = true;
    } else {
      this.isLoading = true;
    }

    this.isError = false;
    this.tasksService
      .getTasksByProject(this.projectId, this.limit, this.offset, this.search())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: HttpResponse<Task[]>) => {
          this.tasks = res.body ?? [];

          const contentRange = res.headers.get('Content-Range');

          this.totalCount = Number(contentRange?.split('/')[1] ?? 0);
          this.totalPages = Math.ceil(this.totalCount / this.limit);

          this.isLoading = false;
          this.isError = false;
        },
        error: () => {
          this.isLoading = false;
          this.isError = true;
        },
      });
  }

  onRowClick(task: Task) {
    this.openPopupService.open(task.id);
  }
}
