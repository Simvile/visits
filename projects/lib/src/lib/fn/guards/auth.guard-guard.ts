import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ShellService } from '../../../public-api';

export const authGuard: CanActivateFn = () => {
  const shell  = inject(ShellService);
  const router = inject(Router);

  if (shell.isAuthenticated()) return true;

  return router.createUrlTree(['']);
};