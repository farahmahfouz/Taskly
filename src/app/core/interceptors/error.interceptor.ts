import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { ToastService } from '../services/toast.service';
import { catchError, throwError } from 'rxjs';

export const SKIP_GLOBAL_ERROR_TOAST = new HttpContextToken<boolean>(() => false);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const skipGlobal = req.context.get(SKIP_GLOBAL_ERROR_TOAST);

      if (err.status === 0) {
        toast.showError('Network error. Please check your connection.');
        return throwError(() => err);
      }
      if (err.status === 401) {
        authService.clearSession();
        toast.showError('Session expired. Please login again.');
        router.navigate(['/login'], {
          queryParams: { returnUrl: router.url },
        });
        return throwError(() => err);
      }

      if (err.status === 403 && !skipGlobal) {
        toast.showError('You are not allowed to perform this action.');
        return throwError(() => err);
      }

      return throwError(() => err);
    }),
  );
};
