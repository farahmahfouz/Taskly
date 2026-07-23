import { Component, input, OnInit } from '@angular/core';
import { DateIconComponent, WarningIconComponent } from '../../../../shared/icons';
import { TasksService } from '../../tasks.service';
import { ProjectContextService } from '../../../../core/services/project-context.service';
import { Task } from '../../task.constants';
import { DatePipe } from '@angular/common';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { RouterLink } from '@angular/router';
import { OpenPopupService } from '../../../../core/services/open-popup.service';

@Component({
  selector: 'app-tasks-board-view',
  standalone: true,
  imports: [DateIconComponent, DatePipe, InitialsPipe, WarningIconComponent, RouterLink],
  templateUrl: './tasks-board-view.component.html',
  styleUrl: './tasks-board-view.component.css',
})
export class TasksBoardViewComponent implements OnInit {
  status = input.required<any>();

  tasks: Task[] = [];
  projectId = '';

  constructor(
    private tasksService: TasksService,
    private projectContext: ProjectContextService,
    private openPopupService: OpenPopupService,
  ) {}

  ngOnInit(): void {
    const projectId = this.projectContext.activeProjectId();

    if (!projectId) return;
    this.projectId = projectId;

    this.tasksService.getTasksByStatus(projectId, this.status().value).subscribe({
      next: res => {
        this.tasks = res;
      },
      error: err => console.log(err),
    });
  }

  onRowClick(task: Task) {
    this.openPopupService.open(task.id);
  }
}
