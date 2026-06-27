import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignUpRequest } from '../../features/signup/signup';
import { LoginRequest, LoginResponse } from '../../features/login/login';
import { BehaviorSubject, tap } from 'rxjs';

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
    return this.http.post('/auth/v1/signup', body);
  }

  login(body: LoginRequest) {
    return this.http.post<LoginResponse>('/auth/v1/token?grant_type=password', body).pipe(
      tap((res: any) => {
        localStorage.setItem('access_token', res.access_token);
      }),
    );
  }

  getUser() {
    return this.http.get<any>('/auth/v1/user').pipe(
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
    return !!localStorage.getItem('access_token');
  }
}
