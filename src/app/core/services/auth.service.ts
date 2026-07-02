import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignUpRequest } from '../../features/auth/signup/signup';
import { LoginRequest, LoginResponse } from '../../features/auth/login/login';
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
    return this.http.post<LoginResponse>(`${API.AUTH}/token?grant_type=password`, body);
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

  refreshToken() {
    const refreshToken =
      localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ??
      sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    return this.http
      .post<any>(`${API.AUTH}/token?grant_type=refresh_token`, {
        refresh_token: refreshToken,
      })
      .pipe(
        tap(res => {
          const storage = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY)
            ? localStorage
            : sessionStorage;
          storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.access_token);
          storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.refresh_token);
        }),
      );
  }

  forgotPassword(email: string) {
    return this.http.post(`${API.AUTH}/recover`, { email });
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!(
      localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    );
  }

  logout() {
    return this.http.post(`${API.AUTH}/logout`, {});
  }
}
