import { TestBed } from '@angular/core/testing';
import { Payload, StateService, State } from './state.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RepoUsersService } from './repo.users.service';
import { RepoMeetsService } from './repo-meets.service';
import { Meet } from '../models/meet.model';
import { Observable, of } from 'rxjs';

describe('StateService', () => {
  let stateService: StateService;
  let repoUsersService: jasmine.SpyObj<RepoUsersService>;
  let repoMeetsService: jasmine.SpyObj<RepoMeetsService>;

  beforeEach(() => {
    const repoUsersSpy = jasmine.createSpyObj('RepoUsersService', [
      'login',
      'getById',
      'create',
      'update',
      'saveMeet',
      'deleteMeet',
    ]);

    const repoMeetsSpy = jasmine.createSpyObj('RepoMeetsService', ['getAll']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StateService,
        { provide: RepoUsersService, useValue: repoUsersSpy },
        { provide: RepoMeetsService, useValue: repoMeetsSpy },
      ],
    });

    stateService = TestBed.inject(StateService);
    repoUsersService = TestBed.inject(
      RepoUsersService
    ) as jasmine.SpyObj<RepoUsersService>;
    repoMeetsService = TestBed.inject(
      RepoMeetsService
    ) as jasmine.SpyObj<RepoMeetsService>;
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
    expect(stateService.state.loginState).toEqual('logging');
  });

  it('should set login', () => {
    const payload = { id: 'mockId', exp: 1234567890 };
    spyOn(stateService, 'jwtDecode').and.returnValue(payload);

    const mockUser = { id: 'mockId', name: 'John Doe' };
    spyOn(localStorage, 'setItem');
    repoUsersService.getById.and.returnValue(of(mockUser));
    stateService.setLogin('token');
    stateService.getState().subscribe((state: State) => {
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
    expect(stateService.state.loginState).toBe('error');
  });

  it('should return filtered and mapped routes', () => {
    const result = stateService.setRoutes();

    expect(result.length).toBe(6);
    expect(result).toEqual([
      { title: 'Landing', path: 'landing' },
      { title: 'Home', path: 'home' },
      { title: 'Login', path: 'login' },
      { title: 'Registro', path: 'register' },
      { title: 'Quedadas', path: 'meets' },
      { title: 'Error', path: 'error' },
    ]);
  });

  it('should set logout', () => {
    spyOn(localStorage, 'removeItem');

    stateService.setLogout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('TFD');
    expect(stateService.state.loginState).toEqual('idle');
    expect(stateService.state.token).toBeNull();
    expect(stateService.state.currentPayload).toBeNull();
    expect(stateService.state.currentUser).toBeNull();
  });

  it('should return user state observable', () => {
    const state$ = stateService.getState();
    expect(state$).toEqual(jasmine.any(Observable));
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

  it('should load all meets', () => {
    const mockMeets: Meet[] = [
      { id: '1', title: 'Meet1' },
      { id: '2', title: 'Meet2' },
    ] as Meet[];

    repoMeetsService.getAll.and.returnValue(of(mockMeets));
    const nextSpy = spyOn(stateService['state$'], 'next').and.callThrough();

    stateService.loadMeets();

    expect(nextSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        loginState: 'idle',
        token: null,
        currentPayload: null,
        currentUser: null,
        meets: mockMeets,
      })
    );
  });

  it('should save meet for user', () => {
    const userId = '1';
    const meetId = '2';
    const token = 'mockToken';
    const mockUser = { id: userId, name: 'John Doe' };

    spyOnProperty(stateService, 'state', 'get').and.returnValue({
      ...stateService.state,
      currentUser: mockUser,
      token: token,
    });
    repoUsersService.saveMeet.and.returnValue(of(mockUser));

    stateService.saveMeet(userId, meetId);

    expect(repoUsersService.saveMeet).toHaveBeenCalledWith(
      userId,
      meetId,
      token
    );

    expect(stateService.state.currentUser).toEqual(mockUser);
  });

  it('should delete meet for user', () => {
    const userId = '1';
    const meetId = '2';
    const token = 'mockToken';

    spyOnProperty(stateService, 'state', 'get').and.returnValue({
      ...stateService.state,
      token: token,
    });

    repoUsersService.deleteMeet.and.returnValue(of({}));

    stateService.deleteMeet(userId, meetId);

    expect(repoUsersService.deleteMeet).toHaveBeenCalledWith(
      userId,
      meetId,
      token
    );

    expect(stateService['state$'].value.currentUser).toEqual({});
  });

  it('should set delete card state', () => {
    const shouldDelete = true;
    stateService.setDeleteCardState(shouldDelete);
    expect(stateService.getDeleteCardState()).toBe(shouldDelete);
  });

  it('should get delete card state', () => {
    const initialState = false;
    stateService.cardDeleteState = initialState;
    expect(stateService.getDeleteCardState()).toBe(initialState);
  });
});
