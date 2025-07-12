import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.utente$.pipe(
    filter((user) => user !== undefined),
    take(1),
    map((user) => {
      if (user === null) {
        router.navigate(['/auth']);
        return false;
      }
      return true;
    })
  );
};

// Per CanActivateChild puoi esportare la stessa funzione (riutilizzo totale):
export const authGuardChild: CanActivateChildFn = authGuard;
