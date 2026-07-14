import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/auth.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { STORAGE_KEYS } from '../utils/constants';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const expiry =
    localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY) ??
    sessionStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY);

  const isExpired = expiry && Date.now() > Number(expiry);

  if (auth.getCurrentUser() && !isExpired) {
    return true;
  }

  if (isExpired) {
    return auth.refreshToken().pipe(
      switchMap(() => auth.getUser()),
      map(() => true),
      catchError(() => {
        localStorage.clear();
        sessionStorage.clear();
        return of(router.createUrlTree(['/login']));
      }),
    );
  }

  return auth.getUser().pipe(
    map(() => true),
    catchError(err => {
      localStorage.clear();
      sessionStorage.clear();
      return of(router.createUrlTree(['/login']));
    }),
  );
};
