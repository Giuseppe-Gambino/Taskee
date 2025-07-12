import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    map((isLoggedIn) => (isLoggedIn ? true : router.createUrlTree(['/auth'])))
  );
};

// Per CanActivateChild puoi esportare la stessa funzione (riutilizzo totale):
export const authGuardChild: CanActivateChildFn = authGuard;
