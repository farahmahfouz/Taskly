import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../utils/enviroment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');

  const apiReq = req.clone({
    url: environment.apiUrl + req.url,
    setHeaders: {
      apikey: environment.supabaseAnonKey,
      Authorization: `Bearer ${token ?? environment.supabaseAnonKey}`,
    },
  });

  return next(apiReq);
};