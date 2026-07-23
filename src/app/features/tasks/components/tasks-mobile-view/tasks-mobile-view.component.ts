import { Component } from '@angular/core';
import { Task } from '../../task.constants';
import { TasksService } from '../../tasks.service';
import { ProjectContextService } from '../../../../core/services/project-context.service';
import { DatePipe, NgClass } from '@angular/common';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { EditIconComponent } from "../../../../shared/icons/edit-icon.component";

@Component({
  selector: 'app-tasks-mobile-view',
  standalone: true,
  imports: [NgClass, InitialsPipe, DatePipe, EditIconComponent],
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
  constructor(
    private tasksService: TasksService,
    private projectContext: ProjectContextService,
  ) {}

  ngOnInit(): void {
    const projectId = this.projectContext.activeProjectId();

    if (!projectId) return;
    this.projectId = projectId;

    this.tasksService.getTasksByProject(projectId).subscribe({
      next: res => {
        this.tasks = res;
        // this.totalTasks = res.length;
      },
      error: err => console.log(err),
    });
  }
}
