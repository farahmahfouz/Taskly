import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../utils/enviroment';
import { STORAGE_KEYS } from '../utils/constants';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  const apiReq = req.clone({
    url: environment.apiUrl + req.url,
    setHeaders: {
      apikey: environment.supabaseAnonKey,
      Authorization: `Bearer ${token ?? environment.supabaseAnonKey}`,
    },
  });

  return next(apiReq);
};