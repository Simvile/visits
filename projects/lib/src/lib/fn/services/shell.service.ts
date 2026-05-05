import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { map, Observable, tap } from 'rxjs';
import { AuthResponse, AuthService, AuthUserModel, DecodedToken, LoginRequest } from '../../api';
import { API_CONFIG } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class ShellService {

  private authService = inject(AuthService);

  private _user = signal<AuthUserModel | null>(null);
  private _auth = signal<AuthResponse | null>(null);

  user = computed(() => this._user());
  auth = computed(() => this._auth());
  isAuthenticated = computed(() => !!this._auth());

signIn(payload: LoginRequest): Observable<AuthUserModel> {
  return this.authService.apiAuthLoginPost(payload).pipe(
    map((res) => {
      if (!res.accessToken) {
        throw new Error('Missing access token');
      }

      const decoded = jwtDecode<DecodedToken>(res.accessToken);

      const user: AuthUserModel = {
        id: decoded.sub,
        fullName: decoded.fullName,
        email: decoded.email,
        institutionId: decoded.institutionId
      };

      // side effects (state + storage)
      this._auth.set(res);
      localStorage.setItem('auth_tokens', JSON.stringify(res));

      this._user.set(user);
      localStorage.setItem('auth_user', JSON.stringify(user));

      return user;
    })
  );
}

  logout() {
    this._user.set(null);
    this._auth.set(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_tokens');
  }

  restoreSession() {
    const tokenData = localStorage.getItem('auth_tokens');
    const userData = localStorage.getItem('auth_user');

    if (!tokenData || !userData) return;

    const auth: AuthResponse = JSON.parse(tokenData);
    const user: AuthUserModel = JSON.parse(userData);

    const now = new Date();

    if (new Date(auth.accessTokenExpiry!) < now) {
      this.logout();
      return;
    }

    this._auth.set(auth);
    this._user.set(user);
  }

  getAccessToken(): string | null {
    return this._auth()?.accessToken || null;
  }

}
