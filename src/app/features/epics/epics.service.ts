import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateEpicRequest } from './epic.model';
import { API } from '../../core/utils/constants';

@Injectable({
  providedIn: 'root'
})
export class EpicsService {

  constructor(private http: HttpClient) { }

  createNewEpic(data: CreateEpicRequest){
    return this.http.post<CreateEpicRequest>(`${API.EPICS}`, data);
  }
}
