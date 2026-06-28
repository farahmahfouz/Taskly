import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const expiry = localStorage.getItem('session_expiry');
  if (expiry && Date.now() > Number(expiry)) {
    localStorage.clear();
    return router.createUrlTree(['/login']);
  }

  if (auth.getCurrentUser()) {
    return true;
  }

  return auth.getUser().pipe(
    map(() => true),
    catchError(() => {
      return of(router.createUrlTree(['/login']));
    }),
  );
};
