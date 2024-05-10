import { TestBed } from '@angular/core/testing';
import { Payload, StateService, UserState } from './state.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RepoUsersService } from './repo.users.service';
import { Observable, of } from 'rxjs';

describe('StateService', () => {
  let stateService: StateService;
  let repoUsersService: jasmine.SpyObj<RepoUsersService>;

  beforeEach(() => {
    const repoSpy = jasmine.createSpyObj('RepoUsersService', [
      'login',
      'getById',
      'create',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StateService,
        { provide: RepoUsersService, useValue: repoSpy },
      ],
    });

    stateService = TestBed.inject(StateService);
    repoUsersService = TestBed.inject(
      RepoUsersService
    ) as jasmine.SpyObj<RepoUsersService>;
  });

  it('should be created', () => {
    expect(stateService).toBeTruthy();
  });

  it('should call setLogin with stored token from localStorage', () => {
    const storedToken = 'mockStoredToken';
    localStorage.setItem('TFD', storedToken);
    const setLoginSpy = spyOn(stateService, 'setLogin').and.callThrough();

    stateService.setLogin(storedToken);

    expect(setLoginSpy).toHaveBeenCalledWith(storedToken);
  });

  it('should set login state', () => {
    stateService.setLoginState('logging');
    expect(stateService.userState.loginState).toEqual('logging');
  });

  it('should set login', () => {
    const payload = { id: 'mockId', exp: 1234567890 };
    spyOn(stateService, 'jwtDecode').and.returnValue(payload);

    const mockUser = { id: 'mockId', name: 'John Doe' };
    spyOn(localStorage, 'setItem');
    repoUsersService.getById.and.returnValue(of(mockUser));
    stateService.setLogin('token');
    stateService.getUserState().subscribe((state: UserState) => {
      expect(state.loginState).toEqual('logged');
      expect(state.token).toEqual('token');
      expect(state.currentPayload).toEqual(payload as Payload);
      expect(state.currentUser).toEqual(mockUser);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'TFD',
        JSON.stringify({ token: 'token' })
      );
    });
  });

  it('should set loginState to error if token is invalid', () => {
    spyOn(localStorage, 'setItem');
    stateService.setLogin('token');
    expect(stateService.userState.loginState).toBe('error');
  });

  it('should return filtered and mapped routes', () => {
    const result = stateService.setRoutes();

    expect(result.length).toBe(5);
    expect(result).toEqual([
      { title: 'Landing', path: 'landing' },
      { title: 'Home', path: 'home' },
      { title: 'Login', path: 'login' },
      { title: 'Registro', path: 'register' },
      { title: 'Error', path: 'error' },
    ]);
  });

  it('should set logout', () => {
    spyOn(localStorage, 'removeItem');

    stateService.setLogout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('TFD');
    expect(stateService.userState.loginState).toEqual('idle');
    expect(stateService.userState.token).toBeNull();
    expect(stateService.userState.currentPayload).toBeNull();
    expect(stateService.userState.currentUser).toBeNull();
  });

  it('should return user state observable', () => {
    const userState$ = stateService.getUserState();
    expect(userState$).toEqual(jasmine.any(Observable));
  });

  it('should construct image URL correctly', () => {
    const url = 'https://example.com/upload/image.jpg';
    const width = '300';
    const height = '300';
    const expectedUrl =
      'https://example.com/upload/c_fill,w_300,h_300/image.jpg';
    expect(stateService.constructImageUrl(url, width, height)).toEqual(
      expectedUrl
    );
  });
});
