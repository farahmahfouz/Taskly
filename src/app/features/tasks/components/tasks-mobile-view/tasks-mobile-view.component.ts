import { Component, DestroyRef } from '@angular/core';
import { Task } from '../../task.constants';
import { TasksService } from '../../tasks.service';
import { ProjectContextService } from '../../../../core/services/project-context.service';
import { DatePipe, NgClass } from '@angular/common';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { EditIconComponent } from '../../../../shared/icons/edit-icon.component';
import { HttpResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InfinteScrollDirective } from '../../../../shared/directives/infinte-scroll.directive';

@Component({
  selector: 'app-tasks-mobile-view',
  standalone: true,
  imports: [NgClass, InitialsPipe, DatePipe, EditIconComponent, InfinteScrollDirective],
  templateUrl: './tasks-mobile-view.component.html',
  styleUrl: './tasks-mobile-view.component.css',
})
export class TasksMobileViewComponent {
  tasks: Task[] = [];
  projectId = '';

  statusStyles: Record<string, string> = {
    TO_DO: 'bg-surface-highest text-neutral-dark',
    IN_PROGRESS: 'bg-primary/10 text-primary',
    BLOCKED: 'bg-[#FFDAD6] text-error',
    IN_REVIEW: 'bg-green-100 text-green-700',
    READY_FOR_QA: 'bg-yellow-100 text-yellow-700',
    REOPENED: 'bg-orange-100 text-orange-700',
    READY_FOR_PRODUCTION: 'bg-cyan-100 text-cyan-700',
    DONE: 'bg-green-100 text-green-700',
  };

  currentPage = 1;
  limit = 2;

  totalCount = 0;
  totalPages = 0;

  isLoading = false;
  isError = false;

  constructor(
    private tasksService: TasksService,
    private projectContext: ProjectContextService,
    private destroyRef: DestroyRef,
  ) {}

  get offset() {
    return (this.currentPage - 1) * this.limit;
  }

  ngOnInit(): void {
    const projectId = this.projectContext.activeProjectId();

    if (!projectId) return;
    this.projectId = projectId;

    this.getTasks();
  }

  loadMore() {
    if (this.isLoading) return;
    if (this.currentPage >= this.totalPages) return;

    this.currentPage++;
    this.getTasks(true);
  }

  private getTasks(mobileScreenLoader = false) {
    if (mobileScreenLoader) {
      this.isLoading = true;
    } else {
      this.isLoading = true;
    }
    this.tasksService
      .getTasksByProject(this.projectId, this.limit, this.offset)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: HttpResponse<Task[]>) => {
          const newTasks = res.body ?? [];

          this.tasks = mobileScreenLoader ? [...this.tasks, ...newTasks] : newTasks;

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

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.getTasks();
  }
}
