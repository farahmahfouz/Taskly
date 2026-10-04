import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/auth.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { STORAGE_KEYS } from '../utils/constants';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.getCurrentUser()) {
    return true;
  }

  return auth.getUser().pipe(
    map(() => true),
    catchError(err => {
      auth.clearSession();
      return of(router.createUrlTree(['/login']));
    }),
  );
};
