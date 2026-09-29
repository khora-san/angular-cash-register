import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from './auth';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { API_URL } from '../api';

/**
 * Adds the Authorization header to outgoing requests when a token is available.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const token = authService.token();

  const clonedReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  const router = inject(Router);

  return next(clonedReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && req.url !== `${API_URL}/auth/login`) {
        authService.clearToken();
        void router.navigateByUrl('/login');
      }
      return throwError(() => err);
    }),
  );
};
