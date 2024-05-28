import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { User, UserLoginDto } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RepoUsersService {
  httpClient = inject(HttpClient);
  url = environment.API_URL + `/users`;

  getUsers() {
    return this.httpClient.get<User[]>(this.url);
  }

  login(data: UserLoginDto) {
    return this.httpClient.post<{ token: string }>(this.url + '/login', data);
  }

  getById(id: string) {
    return this.httpClient.get(this.url + '/' + id);
  }

  create(data: FormData) {
    console.log(data);
    const url = this.url + '/register';
    return this.httpClient.post(url, data);
  }

  update(data: FormData, userId: string) {
    return this.httpClient.patch(this.url + '/' + userId, data);
  }

  delete(userId: string) {
    return this.httpClient.delete(`${this.url}/${userId}`);
  }

  searchUserByName(username: string): Observable<User[]> {
    return this.httpClient.get<User[]>(this.url + '?username=' + username);
  }

  saveMeet(userId: string, meetId: string) {
    return this.httpClient.post(
      `${this.url}/${userId}/saved-meets/${meetId}`,
      {}
    );
  }

  deleteMeet(userId: string, meetId: string) {
    return this.httpClient.delete(
      `${this.url}/${userId}/saved-meets/${meetId}`
    );
  }

  joinMeet(userId: string, meetId: string) {
    return this.httpClient.post(
      `${this.url}/${userId}/joined-meets/${meetId}`,
      {}
    );
  }

  leaveMeet(userId: string, meetId: string) {
    return this.httpClient.delete(
      `${this.url}/${userId}/joined-meets/${meetId}`
    );
  }
}
