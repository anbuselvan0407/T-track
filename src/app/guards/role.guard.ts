import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getUserRole();
  const allowedRoles = route.data['roles'] as string[];

  if (authService.isLoggedIn() && allowedRoles.includes(userRole!)) {
    return true;
  } else {
    alert('Access Denied');
    return router.parseUrl('/dashboard');
  }
};
