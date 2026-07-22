import { Component } from '@angular/core';
import { SearchIconComponent } from '../../shared/icons';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TasksListViewComponent } from "./tasks-list-view/tasks-list-view.component";
import { TasksBoardViewComponent } from "./tasks-board-view/tasks-board-view.component";
import { ProjectContextService } from '../../core/services/project-context.service';
import { TASK_STATUSES } from './task.constants';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [SearchIconComponent, TasksListViewComponent, TasksBoardViewComponent, RouterLink],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectContext: ProjectContextService,
  ) {}
  currentView = 'board';
  projectId = '';
  statuses = TASK_STATUSES;

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const view = params.get('view');

      if (!view) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { view: 'board' },
          queryParamsHandling: 'merge',
        });
        return;
      }

      this.currentView = view;
    });

    const projectId = this.projectContext.activeProjectId();

    if (!projectId) return;
    this.projectId = projectId;
  }

  changeView(event: Event) {
    const view = (event.target as HTMLSelectElement).value;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view },
      queryParamsHandling: 'merge',
    });
  }
}
