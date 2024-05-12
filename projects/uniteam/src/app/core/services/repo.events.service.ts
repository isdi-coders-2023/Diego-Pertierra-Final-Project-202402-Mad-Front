import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class RepoEventsService {
  httpClient = inject(HttpClient);
  url = environment.API_URL + `/events`;

  getAll(): Observable<Event[]> {
    return this.httpClient.get<Event[]>(this.url + '/');
  }

  getById(id: string): Observable<Event> {
    return this.httpClient.get<Event>(this.url + '/' + id);
  }
}
