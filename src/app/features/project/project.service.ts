import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateProjectPayload, Project } from './project.model';
import { API } from '../../core/utils/constants';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  createProject(data: CreateProjectPayload) {
    return this.http.post<Project>(`${API.PROJECT}`, data);
  }

  getAllProjects() {
    return this.http.get<Project[]>(`${API.PROJECT}`);
  }

  getProjectById(id: string) {
    return this.http
      .get<Project[]>(`${API.PROJECT}?id=eq.${id}&select=*`)
      .pipe(map(projects => projects[0]));
  }

  updateProject(id: string, body: any) {
    return this.http.patch(`${API.PROJECT}?id=eq.${id}`, body);
  }
}
