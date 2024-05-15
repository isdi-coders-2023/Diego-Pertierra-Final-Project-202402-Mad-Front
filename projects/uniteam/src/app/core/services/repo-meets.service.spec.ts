import { TestBed } from '@angular/core/testing';

import { RepoMeetsService } from './repo-meets.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Meet } from '../models/meet.model';

describe('RepoMeetsService', () => {
  let service: RepoMeetsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RepoMeetsService],
    });
    service = TestBed.inject(RepoMeetsService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all Meets', () => {
    const mockMeets: Meet[] = [
      { id: '1', title: 'Meet1' },
      { id: '2', title: 'Meet2' },
    ] as Meet[];

    service.getAll().subscribe((meets: Meet[]) => {
      expect(meets.length).toBe(2);
      expect(meets).toEqual(mockMeets);
    });

    const req = httpMock.expectOne(`${service.url}/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMeets);
  });

  it('should fetch Meet by id', () => {
    const meetId = '1';
    const mockMeet: Meet = { id: meetId, title: 'Meet1' } as Meet;

    service.getById(meetId).subscribe((meet: Meet) => {
      expect(meet).toEqual(mockMeet);
    });

    const req = httpMock.expectOne(`${service.url}/${meetId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMeet);
  });
});