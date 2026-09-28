import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { API_URL } from '../api';
import { LoginResponse } from '../models';

@Service()
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly tokenSignal = signal<string | null>(sessionStorage.getItem('token'));
  readonly token = this.tokenSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.token() !== null);

  /**
   * Logs in and stores the received token (signal + sessionStorage).
   */
  login(login: string, password: string) {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, { login, password }).pipe(
      tap((response) => {
        this.tokenSignal.set(response.token);
        sessionStorage.setItem('token', response.token);
      }),
    );
  }

  /**
   * Logs out and forgets the received token (signal + sessionStorage).
   */
  logout() {
    return this.http.post(`${API_URL}/auth/logout`, null).pipe(
      tap(() => {
        this.clearToken();
      }),
    );
  }

  /**
   * Clears the stored token (signal + sessionStorage) without contacting the server.
   */
  clearToken() {
    this.tokenSignal.set(null);
    sessionStorage.removeItem('token');
  }
}
