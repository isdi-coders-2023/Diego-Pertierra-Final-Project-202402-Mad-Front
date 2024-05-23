import { Injectable, inject } from '@angular/core';
import { routes } from '../../app.routes';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, filter, map, switchMap } from 'rxjs';
import { RepoUsersService } from './repo.users.service';
import { RepoMeetsService } from './repo-meets.service';
import { Meet } from '../models/meet.model';
import { User, UserUpdateDto } from '../models/user.model';

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
  private loginComplete$ = new BehaviorSubject<boolean>(false);
  private meetState = new BehaviorSubject<Meet[]>([]);
  meetState$ = this.meetState.asObservable();

  jwtDecode = jwtDecode;
  private meets: Meet[] = [];

  getState(): Observable<State> {
    return this.state$.asObservable();
  }

  get state(): State {
    return this.state$.value;
  }

  setRoutes() {
    return routes
      .filter((route) => route.path !== '**' && route.path !== '')
      .map((route) => ({
        title: route.title as string,
        path: route.path as string,
      }));
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
        if (this.state.loginState === 'logged') {
          console.log('User logged in');
          this.loginComplete$.next(true);
        }
      });
    } catch (error) {
      console.error('Error decoding token:', error);
      this.setLoginState('error');
    }
  }

  get loginCompletion$() {
    return this.loginComplete$.asObservable();
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
    let urlParts;
    if (url) {
      urlParts = url.split('/upload/');
      const firstPart = urlParts![0] + '/upload/';
      const secondPart = urlParts![1];
      return (
        firstPart + 'c_fill,' + 'w_' + width + ',h_' + height + '/' + secondPart
      );
    }

    return '';
  }

  loadMeets() {
    this.repoMeets.getAll().subscribe((meets) => {
      this.state$.next({ ...this.state$.value, meets });
    });
  }

  loadMeetById(id: string) {
    return this.loginCompletion$.pipe(
      filter((loggedIn) => loggedIn === true),
      switchMap(() => this.repoMeets.getById(id))
    );
  }

  saveMeet(userId: string, meetId: string, event: Event) {
    event.stopPropagation();
    this.repoUsers.saveMeet(userId, meetId).subscribe((data) => {
      this.state$.next({
        ...this.state$.value,
        currentUser: data,
      });
    });
  }

  deleteMeet(userId: string, meetId: string, event: Event) {
    event.stopPropagation();
    this.repoUsers.deleteMeet(userId, meetId).subscribe((data) => {
      this.state$.next({
        ...this.state$.value,
        currentUser: data,
      });
    });
  }

  joinMeet(userId: string, meetId: string) {
    this.repoUsers.joinMeet(userId, meetId).subscribe((data) => {
      this.state$.next({
        ...this.state$.value,
        currentUser: data,
      });
    });
    this.meetState.next(this.meets);
  }

  leaveMeet(userId: string, meetId: string) {
    this.repoUsers.leaveMeet(userId, meetId).subscribe((data) => {
      this.state$.next({
        ...this.state$.value,
        currentUser: data,
      });
    });
    this.meetState.next(this.meets);
  }

  hasMeet(user: User, meetId: string): boolean {
    if (user.id && meetId) {
      return user.joinedMeets.some((meet) => meet.id === meetId);
    }
    return false;
  }

  updateUser(user: UserUpdateDto): Observable<UserUpdateDto> {
    return this.repoUsers.update(user, user.id as string).pipe(
      map((updatedUser) => {
        const currentState = this.state$.value;
        this.state$.next({ ...currentState, currentUser: updatedUser });
        return updatedUser as UserUpdateDto;
      })
    );
  }

  deleteUser(userId: string) {
    return this.repoUsers.delete(userId).subscribe((data) => {
      this.state$.next({
        ...this.state$.value,
        currentUser: data,
      });
    });
  }

  formatDate(date: Date) {
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');

    return `${day}-${month}-${year}`;
  }

  searchMeetsByTitle(title: string): void {
    if (!title || title === '') {
      this.repoMeets.getAll().subscribe((meets) => {
        this.state$.next({ ...this.state$.value, meets });
      });
    }
    this.repoMeets.searchByName(title).subscribe((meets) => {
      this.state$.next({ ...this.state$.value, meets });
    });
  }
}
