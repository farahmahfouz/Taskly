import { Component, effect, input, Input, OnInit } from '@angular/core';
import { DateIconComponent, WarningIconComponent } from '../../../shared/icons';
import { TasksService } from '../tasks.service';
import { ProjectContextService } from '../../../core/services/project-context.service';
import { Task } from '../task.constants';
import { DatePipe } from '@angular/common';
import { InitialsPipe } from '../../../shared/pipes/initials.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-tasks',
  standalone: true,
  imports: [DateIconComponent, DatePipe, InitialsPipe, WarningIconComponent, RouterLink],
  templateUrl: './list-tasks.component.html',
  styleUrl: './list-tasks.component.css',
})
export class ListTasksComponent implements OnInit {
  status = input.required<any>();

  tasks: Task[] = [];
  projectId = '';

  constructor(
    private tasksService: TasksService,
    private projectContext: ProjectContextService,
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


}
