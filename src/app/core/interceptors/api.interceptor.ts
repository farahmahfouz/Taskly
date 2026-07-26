import { HttpInterceptorFn } from '@angular/common/http';
import { ENVIRONMENT } from '../utils/enviroment';
import { STORAGE_KEYS } from '../utils/constants';
import { inject } from '@angular/core';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const env = inject(ENVIRONMENT);
  const token =
    localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ||
    sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  const headers: Record<string, string> = {
    apikey: env.supabaseAnonKey,
  };

  if (!req.headers.has('Authorization')) {
    headers['Authorization'] = `Bearer ${token ?? env.supabaseAnonKey}`;
  }

  const apiReq = req.clone({
    url: env.apiUrl + req.url,
    setHeaders: headers,
  });

  return next(apiReq);
};
