import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateProjectPayload, Project } from './project.model';
import { ProjectOption } from '../statistics/statistics.model';
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

  getAllProjects(limit = 100, offset = 0) {
    return this.http.get<Project[]>(`/rest/v1/rpc/get_projects?limit=${limit}&offset=${offset}`, {
      observe: 'response', // To retrieve all response not just body
      headers: {
        Prefer: 'count=exact', // To retrieve count of all projects and set the count to headers "Content-Range"
      },
    });
  }

  getProjectOptions() {
    return this.getAllProjects(100, 0).pipe(
      map(res =>
        (res.body ?? [])
          .filter((p): p is Project & { id: string } => !!p.id)
          .map(p => ({ id: p.id, name: p.name } satisfies ProjectOption)),
      ),
    );
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
