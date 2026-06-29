import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignUpRequest } from '../../features/signup/signup';
import { LoginRequest, LoginResponse } from '../../features/login/login';
import { BehaviorSubject, tap } from 'rxjs';
import { API, STORAGE_KEYS } from '../utils/constants';

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  department: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  signUp(body: SignUpRequest) {
    return this.http.post(`${API.AUTH}/signup`, body);
  }

  login(body: LoginRequest) {
    return this.http.post<LoginResponse>(`${API.AUTH}/token?grant_type=password`, body).pipe(
      tap((res: any) => {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.access_token);
      }),
    );
  }

  getUser() {
    return this.http.get<any>(`${API.AUTH}/user`).pipe(
      tap(res => {
        const user: CurrentUser = {
          id: res.id,
          email: res.email,
          name: res.user_metadata.name,
          department: res.user_metadata.department,
        };
        this.currentUserSubject.next(user);
      }),
    );
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  logout(){
    return this.http.post(`${API.AUTH}/logout`, {})
  }
}
