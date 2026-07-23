import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { TasksService } from '../../tasks.service';
import { ProjectContextService } from '../../../../core/services/project-context.service';
import { Task } from '../../task.constants';
import { CommonModule, DatePipe } from '@angular/common';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { RouterLink } from '@angular/router';
import { EditIconComponent } from '../../../../shared/icons/edit-icon.component';
import { OpenPopupService } from '../../../../core/services/open-popup.service';

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
  totalPages = 5;
  totalTasks = 24;

  constructor(
    private tasksService: TasksService,
    private projectContext: ProjectContextService,
    private openPopupService: OpenPopupService
  ) {}

  ngOnInit(): void {
    const projectId = this.projectContext.activeProjectId();

    if (!projectId) return;
    this.projectId = projectId;

    this.tasksService.getTasksByProject(projectId).subscribe({
      next: res => {
        console.log(res);
        this.tasks = res;
        this.totalTasks = res.length;
      },
      error: err => console.log(err),
    });
  }

  onRowClick(task: Task) {
    this.openPopupService.open(task.id);
  }
}
