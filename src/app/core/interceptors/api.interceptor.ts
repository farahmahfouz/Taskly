import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../utils/enviroment';
import { STORAGE_KEYS } from '../utils/constants';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const token =
    localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ||
    sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  const headers: Record<string, string> = {
    apikey: environment.supabaseAnonKey,
  };

  if (!req.headers.has('Authorization')) {
    headers['Authorization'] = `Bearer ${token ?? environment.supabaseAnonKey}`;
  }

  const apiReq = req.clone({
    url: environment.apiUrl + req.url,
    setHeaders: headers,
  });

  return next(apiReq);
};