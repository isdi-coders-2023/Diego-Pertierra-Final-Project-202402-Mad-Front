import { Injectable, inject } from '@angular/core';
import { routes } from '../../app.routes';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, filter, map, switchMap } from 'rxjs';
import { RepoUsersService } from './repo.users.service';
import { RepoMeetsService } from './repo-meets.service';
import { Meet } from '../models/meet.model';
import { User } from '../models/user.model';

type LoginState = 'idle' | 'logging' | 'logged' | 'error';

export type Payload = {
  id: string;
  role: string;
} & JwtPayload;

export type State = {
  loginState: LoginState;
  token: string | null;
  currentPayload: Payload | null;
  currentUser: User | null;
  users: User[];
  meets: Meet[];
};

const initialState: State = {
  loginState: 'idle',
  token: null,
  currentPayload: null,
  currentUser: null,
  users: [],
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

  fetchAndSortUsers() {
    this.repoUsers
      .getUsers()
      .pipe(
        map((users) =>
          users.sort((a, b) => a.username.localeCompare(b.username))
        )
      )
      .subscribe((users) => {
        this.state$.next({ ...this.state$.value, users });
      });
  }

  searchUsers(username: string): void {
    if (!username || username === '') {
      this.repoUsers.getUsers().subscribe((users) => {
        this.state$.next({ ...this.state$.value, users });
      });
    }
    this.repoUsers.searchUserByName(username).subscribe((users) => {
      this.state$.next({ ...this.state$.value, users });
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
          currentUser: user as User,
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
      return `${firstPart}c_fill,f_auto,w_${width},h_${height}/${secondPart}`;
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
      const currentState = this.state$.value as State;
      const currentUser = data as User;
      this.state$.next({
        ...currentState,
        currentUser: {
          ...currentState.currentUser,
          savedMeets: currentUser.savedMeets,
        } as User,
      });
    });
  }

  deleteMeet(userId: string, meetId: string, event: Event) {
    event.stopPropagation();
    this.repoUsers.deleteMeet(userId, meetId).subscribe((data) => {
      const currentState = this.state$.value as State;
      const currentUser = data as User;
      this.state$.next({
        ...currentState,
        currentUser: {
          ...currentState.currentUser,
          savedMeets: currentUser.savedMeets,
        } as User,
      });
    });
  }

  joinMeet(userId: string, meetId: string) {
    this.repoUsers.joinMeet(userId, meetId).subscribe((data) => {
      const currentState = this.state$.value as State;
      const currentUser = data as User;
      this.state$.next({
        ...currentState,
        currentUser: {
          ...currentState.currentUser,
          joinedMeets: currentUser.joinedMeets,
        } as User,
      });
    });
  }

  leaveMeet(userId: string, meetId: string) {
    this.repoUsers.leaveMeet(userId, meetId).subscribe((data) => {
      const currentState = this.state$.value as State;
      const currentUser = data as User;
      this.state$.next({
        ...currentState,
        currentUser: {
          ...currentState.currentUser,
          joinedMeets: currentUser.joinedMeets,
        } as User,
      });
    });
  }

  hasMeet(user: User, meetId: string): boolean {
    if (user.id && meetId) {
      return user.joinedMeets.some((meet) => meet.id === meetId);
    }
    return false;
  }

  updateUser(user: FormData, userId: string) {
    return this.repoUsers.update(user, userId).pipe(
      map((updatedUser) => {
        const currentState = this.state$.value;
        this.state$.next({ ...currentState, currentUser: updatedUser as User });
        return updatedUser;
      })
    );
  }

  deleteUser(userId: string) {
    return this.repoUsers.delete(userId).subscribe((data) => {
      this.state$.next({
        ...this.state$.value,
        currentUser: data as User,
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

  isFriend(user: User, friendId: string) {
    const isFriend = user.friends.some((friend) => friend.id === friendId);
    return isFriend;
  }

  addFriend(user: User, friendId: string) {
    if (!this.isFriend(user, friendId) && user.id !== friendId) {
      this.repoUsers.addFriend(user.id, friendId).subscribe((data) => {
        const currentState = this.state$.value as State;
        const currentUser = data as User;
        this.state$.next({
          ...currentState,
          currentUser: {
            ...currentState.currentUser,
            friends: currentUser.friends,
          } as User,
        });
      });
      console.log('friend added!');
    } else {
      console.log('error adding friend');
    }
  }

  deleteFriend(user: User, friendId: string) {
    if (this.isFriend(user, friendId)) {
      this.repoUsers.deleteFriend(user.id, friendId).subscribe((data) => {
        const currentState = this.state$.value as State;
        const currentUser = data as User;
        this.state$.next({
          ...currentState,
          currentUser: {
            ...currentState.currentUser,
            friends: currentUser.friends,
          } as User,
        });
      });
      console.log('friend deleted!');
    } else {
      console.log('error deleting friend');
    }
  }
}
