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
    const req = httpMock.expectOne(
      'https://diego-pertierra-final-project-202402-mad.onrender.com/users/login'
    );
    expect(req.request.method).toBe('POST');
    req.flush(testData);
  });

  it('should fetch user by ID', () => {
    const testId = '1';
    const testData: User = { id: '1', username: 'Ernestina' } as User;
    service.getById(testId).subscribe((data) => {
      expect(data).toEqual(testData);
    });
    const req = httpMock.expectOne(
      `https://diego-pertierra-final-project-202402-mad.onrender.com/users/${testId}`
    );
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
    const req = httpMock.expectOne(
      `https://diego-pertierra-final-project-202402-mad.onrender.com/users/register`
    );
    expect(req.request.method).toBe('POST');
    req.flush(testData);
  });

  it('should update user data', () => {
    const userId = '1';
    const testData: Partial<User> = { username: 'UpdatedName' };
    service.update(testData, userId).subscribe((data) => {
      expect(data).toEqual(testData);
    });
    const req = httpMock.expectOne(
      `https://diego-pertierra-final-project-202402-mad.onrender.com/users/${userId}`
    );
    expect(req.request.method).toBe('PATCH');
    req.flush(testData);
  });

  it('should save meet for user', () => {
    const userId = '1';
    const meetId = '2';
    service.saveMeet(userId, meetId).subscribe((data) => {
      expect(data).toBeTruthy();
    });
    const req = httpMock.expectOne(
      `https://diego-pertierra-final-project-202402-mad.onrender.com/users/${userId}/saved-meets/${meetId}`
    );
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should delete meet for user', () => {
    const userId = '1';
    const meetId = '2';
    service.deleteMeet(userId, meetId).subscribe((data) => {
      expect(data).toBeTruthy();
    });
    const req = httpMock.expectOne(
      `https://diego-pertierra-final-project-202402-mad.onrender.com/users/${userId}/saved-meets/${meetId}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should join meet for user', () => {
    const userId = '1';
    const meetId = '2';
    service.joinMeet(userId, meetId).subscribe((data) => {
      expect(data).toBeTruthy();
    });
    const req = httpMock.expectOne(
      `https://diego-pertierra-final-project-202402-mad.onrender.com/users/${userId}/joined-meets/${meetId}`
    );
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should leave meet for user', () => {
    const userId = '1';
    const meetId = '2';
    service.leaveMeet(userId, meetId).subscribe((data) => {
      expect(data).toBeTruthy();
    });
    const req = httpMock.expectOne(
      `https://diego-pertierra-final-project-202402-mad.onrender.com/users/${userId}/joined-meets/${meetId}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should delete user', () => {
    const userId = '1';
    service.delete(userId).subscribe((data) => {
      expect(data).toBeTruthy();
    });
    const req = httpMock.expectOne(
      `https://diego-pertierra-final-project-202402-mad.onrender.com/users/${userId}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
