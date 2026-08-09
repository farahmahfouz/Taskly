import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { ToastService } from '../services/toast.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { STORAGE_KEYS } from '../utils/constants';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const refreshToken =
    localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ||
    sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

  const router = inject(Router);
  const authService = inject(AuthService);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 0) {
        toast.showError('Network error. Please check your connection.');
        return throwError(() => err);
      }
      if (err.status === 401) {
        if (refreshToken) {
          return authService.refreshToken().pipe(
            switchMap(() => {
              const newToken =
                localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ||
                sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
              const clone = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next(clone);
            }),

            catchError(err => {
              authService.clearSession();
              return throwError(() => err);
            }),
          );
        }
        toast.showError('Session expired. Please login again.');
        router.navigate(['/login'], {
          queryParams: { returnUrl: router.url },
        });
        return throwError(() => err);
      }

      if (err.status === 403) {
        toast.showError('You are not allowed to perform this action.');
        return throwError(() => err);
      }

      if(err.status === 500){
        toast.showError('Internal server error. please try again!');
        return throwError(() => err);
      }

      return throwError(() => err);
    }),
  );
};
