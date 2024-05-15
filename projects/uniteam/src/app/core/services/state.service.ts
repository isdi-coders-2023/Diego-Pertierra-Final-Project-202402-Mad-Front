import { Injectable, inject } from '@angular/core';
import { routes } from '../../app.routes';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { RepoUsersService } from './repo.users.service';
import { RepoMeetsService } from './repo-meets.service';
import { Meet } from '../models/meet.model';

type LoginState = 'idle' | 'logging' | 'logged' | 'error';

export type Payload = {
  id: string;
  role: string;
} & JwtPayload;

export type State = {
  loginState: LoginState;
  token: string | null;
  currentPayload: Payload | null;
  currentUser: unknown | null;
  meets: Meet[];
};

const initialState: State = {
  loginState: 'idle',
  token: null,
  currentPayload: null,
  currentUser: null,
  meets: [],
};

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private repoUsers = inject(RepoUsersService);
  private repoMeets = inject(RepoMeetsService);
  private state$ = new BehaviorSubject<State>(initialState);
  jwtDecode = jwtDecode;

  getState(): Observable<State> {
    return this.state$.asObservable();
  }

  get state(): State {
    return this.state$.value;
  }

  setLoginState(loginState: LoginState): void {
    this.state$.next({ ...this.state$.value, loginState });
  }

  setLogin(token: string) {
    try {
      const currentPayload = this.jwtDecode(token) as Payload;
      localStorage.setItem('TFD', JSON.stringify({ token }));
      this.repoUsers.getById(currentPayload.id).subscribe((user) => {
        this.state$.next({
          ...this.state$.value,
          loginState: 'logged',
          token,
          currentPayload,
          currentUser: user,
        });
      });
    } catch (error) {
      console.error('Error decoding token:', error);
      this.setLoginState('error');
    }
  }

  setLogout() {
    localStorage.removeItem('TFD');
    this.state$.next({
      ...this.state$.value,
      loginState: 'idle',
      token: null,
      currentPayload: null,
    });
  }

  constructImageUrl(url: string, width: string, height: string) {
    const urlParts = url.split('/upload/');
    const firstPart = urlParts[0] + '/upload/';
    const secondPart = urlParts[1];
    return (
      firstPart + 'c_fill,' + 'w_' + width + ',h_' + height + '/' + secondPart
    );
  }

  loadMeets() {
    this.repoMeets.getAll().subscribe((meets) => {
      this.state$.next({ ...this.state$.value, meets });
    });
  }

  saveMeet(userId: string, meetId: string) {
    this.repoUsers
      .saveMeet(userId, meetId, this.state.token!)
      .subscribe((data) => {
        this.state$.next({
          ...this.state$.value,
          currentUser: data,
        });
      });
  }

  deleteMeet(userId: string, meetId: string) {
    this.repoUsers
      .deleteMeet(userId, meetId, this.state.token!)
      .subscribe((data) => {
        this.state$.next({
          ...this.state$.value,
          currentUser: data,
        });
      });
  }

  setRoutes() {
    return routes
      .filter((route) => route.path !== '**' && route.path !== '')
      .map((route) => ({
        title: route.title as string,
        path: route.path as string,
      }));
  }
}
