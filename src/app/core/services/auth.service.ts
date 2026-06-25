import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignUpRequest } from '../../features/signup/signup';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  signUp(body: SignUpRequest) {
    return this.http.post('/auth/v1/signup', body);
  }
}
