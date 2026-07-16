import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateEpicRequest, Epic } from './epic.model';
import { API } from '../../core/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class EpicsService {
  constructor(private http: HttpClient) {}

  createNewEpic(data: CreateEpicRequest) {
    return this.http.post<CreateEpicRequest>(`${API.EPICS}`, data);
  }

  getAllProjectEpics(projectId: string, limit: number, offset: number) {
    return this.http.get<Epic[]>(
      `${API.PROJECT_EPICS}?project_id=eq.${projectId}&limit=${limit}&offset=${offset}`,
      {
        observe: 'response', // To retrieve all response not just body
        headers: {
          Prefer: 'count=exact', // To retrieve count of all projects and set the count to headers "Content-Range"
        },
      },
    );
  }
}
