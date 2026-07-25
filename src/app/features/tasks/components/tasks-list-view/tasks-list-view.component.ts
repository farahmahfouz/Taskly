import { Component, DestroyRef, OnInit } from '@angular/core';
import { TasksService } from '../../tasks.service';
import { ProjectContextService } from '../../../../core/services/project-context.service';
import { Task } from '../../task.constants';
import { CommonModule, DatePipe } from '@angular/common';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { EditIconComponent } from '../../../../shared/icons/edit-icon.component';
import { OpenPopupService } from '../../../../core/services/open-popup.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-tasks-list-view',
  standalone: true,
  imports: [CommonModule, EditIconComponent, InitialsPipe, DatePipe],
  templateUrl: './tasks-list-view.component.html',
  styleUrl: './tasks-list-view.component.css',
})
export class TasksListViewComponent implements OnInit {
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
    private openPopupService: OpenPopupService,
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
    this.getTasks();
  }

  private getTasks() {
    this.isLoading = true;
    this.tasksService
      .getTasksByProject(this.projectId, this.limit, this.offset)
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

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.getTasks();
  }

  nextPage() {
    this.changePage(this.currentPage + 1);
  }

  previousPage() {
    this.changePage(this.currentPage - 1);
  }

  onRowClick(task: Task) {
    this.openPopupService.open(task.id);
  }
}
