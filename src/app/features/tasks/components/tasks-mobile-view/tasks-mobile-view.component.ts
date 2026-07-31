import { Component, DestroyRef, effect, input } from '@angular/core';
import { Task } from '../../task.constants';
import { TasksService } from '../../tasks.service';
import { ProjectContextService } from '../../../../core/services/project-context.service';
import { DatePipe, NgClass } from '@angular/common';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { EditIconComponent } from '../../../../shared/icons/edit-icon.component';
import { HttpResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InfinteScrollDirective } from '../../../../shared/directives/infinte-scroll.directive';
import { TASK_STATUS_BADGE_STYLES } from './../../task.constants';
import { OpenPopupService } from '../../../../core/services/open-popup.service';
import { PaginationBase } from '../../../../shared/classes/pagination.base';
import { LoaderComponent } from "../../../../shared/components/loader/loader.component";

@Component({
  selector: 'app-tasks-mobile-view',
  standalone: true,
  imports: [NgClass, InitialsPipe, DatePipe, EditIconComponent, InfinteScrollDirective, LoaderComponent],
  templateUrl: './tasks-mobile-view.component.html',
  styleUrl: './tasks-mobile-view.component.css',
})
export class TasksMobileViewComponent extends PaginationBase {
  tasks: Task[] = [];
  projectId = '';

  search = input<string>('');

  readonly statusStyles = TASK_STATUS_BADGE_STYLES;

  constructor(
    private tasksService: TasksService,
    private projectContext: ProjectContextService,
    private destroyRef: DestroyRef,
    public openPopupService: OpenPopupService,
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
  }

  protected loadPage(loadMore: boolean) {
    if (loadMore) {
      this.isLoadingMore = true;
    } else if (!this.isFirstLoading) {
      this.isLoading = true;
    }

    this.isError = false;

    this.tasksService
      .getTasksByProject(this.projectId, this.limit, this.offset, this.search())
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
}
