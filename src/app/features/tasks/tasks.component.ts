import { Component, HostListener } from '@angular/core';
import { SearchIconComponent } from '../../shared/icons';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TasksListViewComponent } from './components/tasks-list-view/tasks-list-view.component';
import { TasksBoardViewComponent } from './components/tasks-board-view/tasks-board-view.component';
import { ProjectContextService } from '../../core/services/project-context.service';
import { TASK_STATUSES } from './task.constants';
import { TasksMobileViewComponent } from './components/tasks-mobile-view/tasks-mobile-view.component';
import { TaskPopupComponent } from './components/task-popup/task-popup.component';
import { OpenPopupService } from '../../core/services/open-popup.service';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';
import { SelectComponent } from '../../shared/components/select/select.component';
import { TasksPopupMobileComponent } from './components/tasks-popup-mobile/tasks-popup-mobile.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

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
    SelectComponent,
    TasksPopupMobileComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectContext: ProjectContextService,
    public openPopupService: OpenPopupService,
  ) {}
  currentView = 'board';
  projectId = '';
  statuses = TASK_STATUSES;

  searchControl = new FormControl('');
  search: string | null = '';

  isMobile = window.innerWidth < 768;

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 768;
  }

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

      this.searchControl.valueChanges
        .pipe(debounceTime(500), distinctUntilChanged())
        .subscribe(value => {
          this.search = value;
        });
    });

    const projectId = this.projectContext.activeProjectId();

    if (!projectId) return;
    this.projectId = projectId;
  }

  changeView(view: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view },
      queryParamsHandling: 'merge',
    });
  }

  viewOptions = [
    {
      label: 'Board View',
      value: 'board',
      icon: 'board',
    },
    {
      label: 'List View',
      value: 'table',
      icon: 'list',
    },
  ];
}
