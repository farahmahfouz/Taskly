import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignUpRequest } from '../../features/signup/signup';
import { LoginRequest, LoginResponse } from '../../features/login/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  signUp(body: SignUpRequest) {
    return this.http.post('/auth/v1/signup', body);
  }

  login(body: LoginRequest) {
    return this.http.post<LoginResponse>('/auth/v1/token?grant_type=password', body);
  }
}
