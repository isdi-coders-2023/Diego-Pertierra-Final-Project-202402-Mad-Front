import { TestBed } from '@angular/core/testing';

import { RepoEventsService } from './repo.events.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Event } from '../models/event.model';

describe('RepoEventsService', () => {
  let service: RepoEventsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RepoEventsService],
    });
    service = TestBed.inject(RepoEventsService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all events', () => {
    const mockEvents: Event[] = [
      { id: '1', title: 'event1' },
      { id: '2', title: 'event2' },
    ] as Event[];

    service.getAll().subscribe((events: Event[]) => {
      expect(events.length).toBe(2);
      expect(events).toEqual(mockEvents);
    });

    const req = httpMock.expectOne(`${service.url}/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should fetch event by id', () => {
    const eventId = '1';
    const mockEvent: Event = { id: eventId, title: 'event1' } as Event;

    service.getById(eventId).subscribe((event: Event) => {
      expect(event).toEqual(mockEvent);
    });

    const req = httpMock.expectOne(`${service.url}/${eventId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvent);
  });
});
