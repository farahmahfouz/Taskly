import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateEpicRequest, Epic } from './epic.model';
import { API } from '../../core/utils/constants';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EpicsService {
  private epicsSubject = new BehaviorSubject<Epic[]>([]);
  epics$ = this.epicsSubject.asObservable();

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

  getProjectEpiById(projectId: string, epicId: string) {
    return this.http.get<Epic[]>(`${API.PROJECT_EPICS}?project_id=eq.${projectId}&id=eq.${epicId}`);
  }

  updateEpic(epicId: string, data: any) {
    return this.http
      .patch<Epic[]>(`${API.EPICS}?id=eq.${epicId}`, data, {
        headers: { Prefer: 'return=representation' },
      })
      .pipe(
        tap(updated => {
          const updatedEpic = updated[0];
          if (!updatedEpic) return;
          const current = this.epicsSubject.value;
          this.epicsSubject.next(
            current.map(epic => (epic.id === updatedEpic.id ? { ...epic, ...updatedEpic } : epic)),
          );
        }),
      );
  }

  setEpics(epics: Epic[]) {
    this.epicsSubject.next(epics);
  }

  updateEpicInStore(updatedEpic: Epic) {
  const current = this.epicsSubject.value;

  this.epicsSubject.next(
    current.map(epic =>
      epic.id === updatedEpic.id ? updatedEpic : epic
    )
  );
}
}
