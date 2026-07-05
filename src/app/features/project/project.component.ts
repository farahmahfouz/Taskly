import { Component } from '@angular/core';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { PaginationComponent } from "../../shared/components/pagination/pagination.component";
import { RouterLink } from "@angular/router";
import { ProjectService } from './project.service';
import { Project } from './project.model';
import { SkeltonComponent } from "./components/skelton/skelton.component";
import { EmptyProjectsComponent } from "./components/empty-projects/empty-projects.component";
import { ProjectErrorComponent } from './components/project-error/project-error.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [ProjectCardComponent, PaginationComponent, RouterLink, SkeltonComponent, EmptyProjectsComponent, ProjectErrorComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {
  projects: Project[] = [];
  isLoading = false;
  isError = false;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.isLoading = true;

    this.projectService.getAllProjects().subscribe({
      next: (res: Project[]) => {
        this.projects = res;
        this.isLoading = false;
        this.isError = false;
      },
      error: () => {
        this.isLoading = false;
        this.isError = true;
      },
    });
  }
}
