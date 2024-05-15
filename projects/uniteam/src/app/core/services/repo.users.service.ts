import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { User, UserLoginDto } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class RepoUsersService {
  httpClient = inject(HttpClient);
  url = environment.API_URL + `/users`;

  login(data: UserLoginDto) {
    return this.httpClient.post<{ token: string }>(this.url + '/login', data);
  }

  getById(id: string) {
    return this.httpClient.get(this.url + '/' + id);
  }

  create(data: FormData) {
    const url = this.url + '/register';
    return this.httpClient.post(url, data);
  }

  update(data: Partial<User>, userId: string) {
    return this.httpClient.patch(this.url + '/' + userId, data);
  }

  saveMeet(userId: string, meetId: string, token: string) {
    console.log(`${this.url}/${userId}/saved-meets/${meetId}`);
    console.log(userId, meetId);
    return this.httpClient.post(
      `${this.url}/${userId}/saved-meets/${meetId}`,
      {},
      { headers: { Authorization: 'Bearer ' + token } }
    );
  }

  deleteMeet(userId: string, meetId: string, token: string) {
    return this.httpClient.delete(
      `${this.url}/${userId}/saved-meets/${meetId}`,
      { headers: { Authorization: 'Bearer ' + token } }
    );
  }
}
