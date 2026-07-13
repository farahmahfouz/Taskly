import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { ProjectService } from './project.service';
import { Project } from './project.model';

export const projectResolver: ResolveFn<Project> = (route: ActivatedRouteSnapshot) => {
  const projectService = inject(ProjectService);
  const projectId = route.paramMap.get('id')!;

  return projectService.getProjectById(projectId);
};
