import { Component } from '@angular/core';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { RouterLink } from '@angular/router';
import { ProjectService } from './project.service';
import { Project } from './project.model';
import { SkeltonComponent } from './components/skelton/skelton.component';
import { EmptyProjectsComponent } from './components/empty-projects/empty-projects.component';
import { ProjectErrorComponent } from './components/project-error/project-error.component';
import { HttpResponse } from '@angular/common/http';

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
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent {
  projects: Project[] = [];
  isLoading = false;
  isError = false;

  currentPage = 1;
  limit = 3;

  totalCount = 0;
  totalPages = 0;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
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

  getProjects() {
    this.isLoading = true;

    this.projectService.getAllProjects(this.limit, this.offset).subscribe({
      next: (res: HttpResponse<Project[]>) => {
        this.projects = res.body ?? [];
        const contentRange = res.headers.get('Content-Range');

        this.totalCount = Number(contentRange?.split('/')[1] ?? 0);

        this.totalPages = Math.ceil(this.totalCount / this.limit);

        this.isLoading = false;
        this.isError = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
      },
    });
  }
}
