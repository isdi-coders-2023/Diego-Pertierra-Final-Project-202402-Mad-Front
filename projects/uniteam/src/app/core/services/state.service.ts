import { Injectable, inject } from '@angular/core';
import { routes } from '../../app.routes';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { RepoUsersService } from './repo.users.service';

type LoginState = 'idle' | 'logging' | 'logged' | 'error';

export type Payload = {
  id: string;
  role: string;
} & JwtPayload;

export type UserState = {
  loginState: LoginState;
  token: string | null;
  currentPayload: Payload | null;
  currentUser: unknown | null;
};

const initialState: UserState = {
  loginState: 'idle',
  token: null,
  currentPayload: null,
  currentUser: null,
};

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private userState$ = new BehaviorSubject<UserState>(initialState);
  private repoUsers = inject(RepoUsersService);

  constructor() {
    const storedToken = localStorage.getItem('TFD');
    if (storedToken) {
      this.setLogin(storedToken);
    }
  }

  getUserState(): Observable<UserState> {
    return this.userState$.asObservable();
  }

  get userState(): UserState {
    return this.userState$.value;
  }

  setLoginState(loginState: LoginState): void {
    this.userState$.next({ ...this.userState$.value, loginState });
  }

  setLogin(token: string) {
    try {
      console.log(token);
      const currentPayload = jwtDecode(token) as Payload;
      localStorage.setItem('TFD', JSON.stringify({ token }));
      this.repoUsers.getById(currentPayload.id).subscribe((user) => {
        this.userState$.next({
          ...this.userState$.value,
          loginState: 'logged',
          token,
          currentPayload,
          currentUser: user,
        });
        console.log(this.userState$);
      });
      console.log(this.userState$.value);
    } catch (error) {
      console.error('Error decoding token:', error);
      this.setLoginState('error');
    }
  }

  setRoutes() {
    return routes
      .filter((route) => route.path !== '**' && route.path !== '')
      .map((route) => ({
        title: route.title as string,
        path: route.path as string,
      }));
  }

  setLogout() {
    localStorage.removeItem('TFD');
    this.userState$.next({
      ...this.userState$.value,
      loginState: 'idle',
      token: null,
      currentPayload: null,
    });
  }
}
