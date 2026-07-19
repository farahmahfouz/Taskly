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

  getAllTasks(epicId: string){
    return this.http.get<Task[]>(`${API.PROJECT_TASKS}?epic_id=eq.${epicId}`)
  }
}
