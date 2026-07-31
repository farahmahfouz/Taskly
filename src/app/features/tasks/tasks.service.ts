import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateTaskRequest, Task } from './task.constants';
import { API } from '../../core/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  createTask(task: CreateTaskRequest) {
    return this.http.post(`${API.TASKS}`, task);
  }

  getAllTasks(epicId: string) {
    return this.http.get<Task[]>(`${API.PROJECT_TASKS}?epic_id=eq.${epicId}`);
  }

  getTasksByStatus(projectId: string, status: string, limit = 5, offset = 0, searchTerm = '') {
    let url = `${API.PROJECT_TASKS}?project_id=eq.${projectId}&status=eq.${status}&limit=${limit}&offset=${offset}`;
    if (searchTerm.trim()) {
      url += `&title=ilike.%25${encodeURIComponent(searchTerm.trim())}%25`;
    }
    return this.http.get<Task[]>(url, {
      observe: 'response',
      headers: { Prefer: 'count=exact' },
    });
  }

  getTasksByProject(projectId: string, limit = 100, offset = 0, searchTerm = '') {
    let url = `${API.PROJECT_TASKS}?project_id=eq.${projectId}&limit=${limit}&offset=${offset}`;

    if (searchTerm.trim()) {
      url += `&title=ilike.%25${encodeURIComponent(searchTerm.trim())}%25`;
    }

    return this.http.get<Task[]>(url, {
      observe: 'response',
      headers: {
        Prefer: 'count=exact', // To retrieve count of all projects and set the count to headers "Content-Range"
      },
    });
  }

  getTask(projectId: string, taskId: string) {
    return this.http.get<Task[]>(`${API.PROJECT_TASKS}?project_id=eq.${projectId}&id=eq.${taskId}`);
  }

  updateTask(taskId: string, data: any) {
    return this.http.patch<Task[]>(`${API.TASKS}?id=eq.${taskId}`, data, {
      headers: { Prefer: 'return=representation' },
    });
  }
}
