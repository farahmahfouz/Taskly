import { Component, DestroyRef, OnInit } from '@angular/core';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { RouterLink } from '@angular/router';
import { ProjectService } from './project.service';
import { Project } from './project.model';
import { SkeltonComponent } from './components/skelton/skelton.component';
import { EmptyProjectsComponent } from './components/empty-projects/empty-projects.component';
import { ProjectErrorComponent } from './components/project-error/project-error.component';
import { HttpResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InfinteScrollDirective } from '../../shared/directives/infinte-scroll.directive';
import { ProjectContextService } from '../../core/services/project-context.service';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    ProjectCardComponent,
    PaginationComponent,
    RouterLink,
    SkeltonComponent,
    EmptyProjectsComponent,
    ProjectErrorComponent,
    InfinteScrollDirective,
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent implements OnInit {
  projects: Project[] = [];
  isLoading = false;
  isError = false;

  currentPage = 1;
  limit = 2;

  totalCount = 0;
  totalPages = 0;

  constructor(
    private projectService: ProjectService,
    private destroyRef: DestroyRef,
    private projectContextService: ProjectContextService,
  ) {}

  ngOnInit() {
    this.projectContextService.clearProjectId();
    this.getProjects();
  }

  get offset() {
    return (this.currentPage - 1) * this.limit;
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.getProjects();
  }

  nextPage() {
    this.changePage(this.currentPage + 1);
  }

  previousPage() {
    this.changePage(this.currentPage - 1);
  }

  loadMore() {
    if (this.isLoading) return;
    if (this.currentPage >= this.totalPages) return;

    this.currentPage++;
    this.getProjects(true);
  }

  getProjects(mobileScreenLoader = false) {
    if (mobileScreenLoader) {
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }

    this.projectService
      .getAllProjects(this.limit, this.offset)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: HttpResponse<Project[]>) => {
          const newProjects = res.body ?? [];

          this.projects = mobileScreenLoader ? [...this.projects, ...newProjects] : newProjects;
          const contentRange = res.headers.get('Content-Range');

          this.totalCount = Number(contentRange?.split('/')[1] ?? 0);

          this.totalPages = Math.ceil(this.totalCount / this.limit);

          this.isLoading = false;
          this.isError = false;
        },
        error: err => {
          this.isLoading = false;
          this.isError = true;
        },
      });
  }
}
