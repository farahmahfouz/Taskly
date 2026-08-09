import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CalendarStatsRequest,
  CalendarStatsResponse,
  ProjectCountRequest,
  ProjectTaskCount,
} from './statistics.model';
import { API } from '../../core/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private http: HttpClient) {}

  getCalendarStats(request: any) {
    return this.http.post<CalendarStatsResponse>(`${API.STATISTICS}/get_tasks_calendar_stats`, request);
  }

  getTasksPerProject(request: ProjectCountRequest) {
    return this.http.post<any>(`${API.STATISTICS}/get_tasks_count_per_project`, request);
  }
}
