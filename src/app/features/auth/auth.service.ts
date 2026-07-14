import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetUserResponse, SignUpRequest, SignUpResponse } from '../../features/auth/signup/signup';
import { LoginRequest, LoginResponse } from '../../features/auth/login/login';
import { BehaviorSubject, tap } from 'rxjs';
import { API, STORAGE_KEYS } from '../../core/utils/constants';

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  department?: string;
  job_title?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  signUp(body: SignUpRequest) {
    return this.http.post<SignUpResponse>(`${API.AUTH}/signup`, body).pipe(tap(res => this.rememberMe(res, false)));
  }

  login(body: LoginRequest, rememberMeValue: boolean) {
    return this.http
      .post<LoginResponse>(`${API.AUTH}/token?grant_type=password`, body)
      .pipe(tap(res => this.rememberMe(res, rememberMeValue)));
  }

  getUser() {
    return this.http.get<GetUserResponse>(`${API.AUTH}/user`).pipe(
      tap(res => {
        const user: CurrentUser = {
          id: res.id,
          email: res.email,
          name: res.user_metadata.name,
          department: res.user_metadata.department,
          job_title: res.user_metadata.job_title,
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

  resetPassword(password: string, token: string) {
    return this.http.put(
      `${API.AUTH}/user`,
      { password },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
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
    return this.http.post(`${API.AUTH}/logout`, {}).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
        localStorage.clear();
        sessionStorage.clear();
      }),
    );
  }

  private rememberMe(res: LoginResponse, rememberMe: boolean) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, res.access_token);
    storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.refresh_token);

    if (rememberMe) {
      const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRY, expiry.toString());
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRY);
    }
  }
}
