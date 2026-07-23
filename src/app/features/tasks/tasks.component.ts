import { Component } from '@angular/core';
import { SearchIconComponent } from '../../shared/icons';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TasksListViewComponent } from './components/tasks-list-view/tasks-list-view.component';
import { TasksBoardViewComponent } from './components/tasks-board-view/tasks-board-view.component';
import { ProjectContextService } from '../../core/services/project-context.service';
import { Task, TASK_STATUSES } from './task.constants';
import { TasksMobileViewComponent } from './components/tasks-mobile-view/tasks-mobile-view.component';
import { TaskPopupComponent } from './components/task-popup/task-popup.component';
import { OpenPopupService } from '../../core/services/open-popup.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    SearchIconComponent,
    TasksListViewComponent,
    TasksBoardViewComponent,
    RouterLink,
    TasksMobileViewComponent,
    TaskPopupComponent,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectContext: ProjectContextService,
    public openPopupService: OpenPopupService
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
