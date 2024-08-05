import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/enviroments';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { User, AuthStatus, LoginResponse } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl: string = environment.baseUrl;

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed(() => this._currentUser);
  public authStatus = computed(() => this._authStatus);

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      tap(({ user, token }) => {
        this._currentUser.set(user);
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', token);
        console.log({ user, token });
      }),
      map(() => true)
    );
    catchError((err) => {
      console.log(err);
      return throwError(() => 'Algo salio mal');
    });
    return of(true);
  }
}
