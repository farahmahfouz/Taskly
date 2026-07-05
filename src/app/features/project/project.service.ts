import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateProjectPayload, Project } from './project.model';
import { API } from '../../core/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}
  
  createProject(data: CreateProjectPayload) {
    return this.http.post<Project>(`${API.PROJECT}`, data);
  }
}
