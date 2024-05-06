import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { UserLoginDto } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class RepoUsersService {
  httpClient = inject(HttpClient);
  url = environment.apiUrl + `/users`;

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
}
