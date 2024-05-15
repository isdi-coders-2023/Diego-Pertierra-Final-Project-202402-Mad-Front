import { TestBed } from '@angular/core/testing';
import { RepoUsersService } from './repo.users.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { User, UserLoginDto } from '../models/user.model';

describe('RepoUsersService', () => {
  let service: RepoUsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RepoUsersService],
    });
    service = TestBed.inject(RepoUsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post login data', () => {
    const testData: UserLoginDto = [
      { username: 'Ernestina', password: '12345' },
    ] as unknown as UserLoginDto;
    service.login(testData).subscribe((data) => {
      expect(data).toEqual(data);
    });
    const req = httpMock.expectOne('http://localhost:3400/users/login');
    expect(req.request.method).toBe('POST');
    req.flush(testData);
  });

  it('should fetch user by ID', () => {
    const testId = '1';
    const testData: User = { id: '1', username: 'Ernestina' } as User;
    service.getById(testId).subscribe((data) => {
      expect(data).toEqual(testData);
    });
    const req = httpMock.expectOne(`http://localhost:3400/users/${testId}`);
    expect(req.request.method).toBe('GET');
    req.flush(testData);
  });

  it('should create user', () => {
    const testData: FormData = {
      id: '2',
      username: 'Rodolfo',
    } as unknown as FormData;
    service.create(testData).subscribe((data) => {
      expect(data).toEqual(testData);
    });
    const req = httpMock.expectOne(`http://localhost:3400/users/register`);
    expect(req.request.method).toBe('POST');
    req.flush(testData);
  });

  it('should update user data', () => {
    const userId = '1';
    const testData: Partial<User> = { username: 'UpdatedName' };
    service.update(testData, userId).subscribe((data) => {
      expect(data).toEqual(testData);
    });
    const req = httpMock.expectOne(`http://localhost:3400/users/${userId}`);
    expect(req.request.method).toBe('PATCH');
    req.flush(testData);
  });

  it('should save meet for user', () => {
    const userId = '1';
    const meetId = '2';
    const token = 'mockToken';
    service.saveMeet(userId, meetId, token).subscribe((data) => {
      expect(data).toBeTruthy();
    });
    const req = httpMock.expectOne(
      `http://localhost:3400/users/${userId}/saved-meets/${meetId}`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer ' + token);
    req.flush({});
  });

  it('should delete meet for user', () => {
    const userId = '1';
    const meetId = '2';
    const token = 'mockToken';
    service.deleteMeet(userId, meetId, token).subscribe((data) => {
      expect(data).toBeTruthy();
    });
    const req = httpMock.expectOne(
      `http://localhost:3400/users/${userId}/saved-meets/${meetId}`
    );
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer ' + token);
    req.flush({});
  });
});
