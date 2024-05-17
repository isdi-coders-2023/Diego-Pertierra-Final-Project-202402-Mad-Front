import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
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
}
