import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/auth.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { STORAGE_KEYS } from '../utils/constants';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // const expiresAt =
  //   localStorage.getItem(STORAGE_KEYS.EXPIRES_AT) ??
  //   sessionStorage.getItem(STORAGE_KEYS.EXPIRES_AT);

  // const isExpired = expiresAt && Date.now() > Number(expiresAt) * 1000;

  if (auth.getCurrentUser()) {
    return true;
  }

  // if (isExpired) {
  //   return auth.refreshToken().pipe(
  //     switchMap(() => auth.getUser()),
  //     map(() => true),
  //     catchError(() => {
  //       auth.clearSession();
  //       return of(router.createUrlTree(['/login']));
  //     }),
  //   );
  // }

  return auth.getUser().pipe(
    map(() => true),
    catchError(err => {
      auth.clearSession();
      return of(router.createUrlTree(['/login']));
    }),
  );
};
