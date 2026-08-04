import { Component, DestroyRef, OnInit } from '@angular/core';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { RouterLink } from '@angular/router';
import { ProjectService } from './project.service';
import { Project } from './project.model';
import { SkeltonComponent } from './components/skelton/skelton.component';
import { EmptyProjectsComponent } from './components/empty-projects/empty-projects.component';
import { HttpResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InfinteScrollDirective } from '../../shared/directives/infinte-scroll.directive';
import { ProjectContextService } from '../../core/services/project-context.service';
import { ErrorPageComponent } from '../../shared/components/error-page/error-page.component';
import { PaginationBase } from '../../shared/classes/pagination.base';
import { LoaderComponent } from "../../shared/components/loader/loader.component";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    ProjectCardComponent,
    PaginationComponent,
    RouterLink,
    SkeltonComponent,
    EmptyProjectsComponent,
    InfinteScrollDirective,
    ErrorPageComponent,
    LoaderComponent
],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent extends PaginationBase implements OnInit {
  projects: Project[] = [];

  constructor(
    private projectService: ProjectService,
    private destroyRef: DestroyRef,
    private projectContextService: ProjectContextService,
  ) {
    super();
  }

  ngOnInit() {
    this.projectContextService.clearProjectId();
    this.isFirstLoading = true;
    this.loadPage(false);
  }

  protected loadPage(loadMore: boolean) {
    if (loadMore) {
      this.isLoadingMore = true;
    } else if (!this.isFirstLoading) {
      this.isLoading = true;
    }

    this.isError = false;

    this.projectService
      .getAllProjects(this.limit, this.offset)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: HttpResponse<Project[]>) => {
          const newProjects = res.body ?? [];

          this.projects = loadMore ? [...this.projects, ...newProjects] : newProjects;
          const contentRange = res.headers.get('Content-Range');

          this.totalCount = Number(contentRange?.split('/')[1] ?? 0);

          this.totalPages = Math.ceil(this.totalCount / this.limit);

          this.isLoading = false;
          this.isLoadingMore = false;
          this.isFirstLoading = false;
          this.isError = false;
        },
        error: err => {
          this.isLoading = false;
          this.isLoadingMore = false;
          this.isFirstLoading = false;
          this.isError = true;
        },
      });
  }
}
