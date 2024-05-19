import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meet } from '../models/meet.model';

@Injectable({
  providedIn: 'root',
})
export class RepoMeetsService {
  httpClient = inject(HttpClient);
  url = environment.API_URL + `/meets`;

  getAll(): Observable<Meet[]> {
    return this.httpClient.get<Meet[]>(this.url + '/');
  }

  getById(id: string) {
    return this.httpClient.get<Meet>(this.url + '/' + id);
  }

  create(data: FormData) {
    const url = this.url + '/';
    return this.httpClient.post(url, data);
  }

  searchByName(title: string): Observable<Meet[]> {
    return this.httpClient.get<Meet[]>(this.url + '?title=' + title);
  }
}
