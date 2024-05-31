import { TestBed } from '@angular/core/testing';
import { Payload, StateService, State } from './state.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RepoUsersService } from './repo.users.service';
import { RepoMeetsService } from './repo-meets.service';
import { Meet } from '../models/meet.model';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

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
      'delete',
      'saveMeet',
      'deleteMeet',
      'joinMeet',
      'leaveMeet',
      'loadMeetById',
      'hasMeet',
      'getUsers',
      'searchUserByName',
      'addFriend',
      'deleteFriend',
    ]);

    const repoMeetsSpy = jasmine.createSpyObj('RepoMeetsService', [
      'getAll',
      'getById',
      'searchByName',
    ]);

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
    stateService.setLoginState('logged');
    expect(stateService.state.loginState).toEqual('logged');
  });

  it('should set login', () => {
    const payload = { id: 'mockId', exp: 1234567890 };
    spyOn(stateService, 'jwtDecode').and.returnValue(payload);

    const mockUser = { id: 'mockId', name: 'John Doe' } as unknown as User;
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

    expect(result.length).toBe(10);
    expect(result).toEqual([
      { title: 'Landing', path: 'landing' },
      { title: 'Home', path: 'home' },
      { title: 'Login', path: 'login' },
      { title: 'Registro', path: 'register' },
      { title: 'Quedadas', path: 'meets' },
      { title: 'Quedada', path: 'meets/:id' },
      { title: 'Usuarios', path: 'users' },
      { title: 'Perfil', path: 'profile' },
      { title: 'Nueva quedada', path: 'create-meet' },
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
      'https://example.com/upload/c_fill,f_auto,w_300,h_300/image.jpg';
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
    const mockUser = { id: userId, name: 'John Doe' } as unknown as User;

    spyOnProperty(stateService, 'state', 'get').and.returnValue({
      ...stateService.state,
      currentUser: mockUser as unknown as User,
      token: token,
    });
    repoUsersService.saveMeet.and.returnValue(of(mockUser));

    const mockEvent = new MouseEvent('click');

    stateService.saveMeet(userId, meetId, mockEvent);

    expect(repoUsersService.saveMeet).toHaveBeenCalledWith(userId, meetId);

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

    repoUsersService.deleteMeet.and.returnValue(of({} as Meet));

    const mockEvent = new MouseEvent('click');

    stateService.deleteMeet(userId, meetId, mockEvent);

    expect(repoUsersService.deleteMeet).toHaveBeenCalledWith(userId, meetId);
  });

  it('should join meet for user', () => {
    const userId = '1';
    const meetId = '2';
    const mockUser = { id: userId, joinedMeets: [] } as unknown as User;
    repoUsersService.joinMeet.and.returnValue(of(mockUser));

    stateService.joinMeet(userId, meetId);

    expect(repoUsersService.joinMeet).toHaveBeenCalledWith(userId, meetId);
  });

  it('should leave meet for user', () => {
    const userId = '1';
    const meetId = '2';
    const mockUser = { id: userId, joinedMeets: [] } as unknown as User;
    repoUsersService.leaveMeet.and.returnValue(of(mockUser));

    stateService.leaveMeet(userId, meetId);

    expect(repoUsersService.leaveMeet).toHaveBeenCalledWith(userId, meetId);
  });

  it('should check if user has meet', () => {
    const userId = '1';
    const meetId = '2';
    const mockUser = { id: userId, joinedMeets: [{ id: meetId }] } as User;
    const result = stateService.hasMeet(mockUser, meetId);

    expect(result).toBe(true);
  });

  it('should return false if user does not have meet', () => {
    const userId = '1';
    const meetId = '2';
    const mockUser = { id: userId, joinedMeets: [{ id: '10' }] } as User;
    const result = stateService.hasMeet(mockUser, meetId);

    expect(result).toBe(false);
  });

  it('should update user and emit updated user state', () => {
    const mockData = { username: 'John Doe' } as unknown as FormData;
    const updatedUser = { username: 'Updated Name' };
    const userId = '1';

    repoUsersService.update.and.returnValue(of(updatedUser)); // Use repoUsersService here
    const nextSpy = spyOn(stateService['state$'], 'next').and.callThrough();

    stateService.updateUser(mockData, userId).subscribe((result) => {
      expect(result).toEqual(updatedUser);
    });

    expect(nextSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        currentUser: updatedUser,
      })
    );
  });

  it('should delete user and emit updated user state', () => {
    const userId = '1';

    repoUsersService.delete.and.returnValue(of({}));
    const nextSpy = spyOn(stateService['state$'], 'next').and.callThrough();

    stateService.deleteUser(userId);

    expect(nextSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        loginState: 'idle',
        token: null,
        currentPayload: null,
        currentUser: Object({}),
        meets: [],
      })
    );
  });

  describe('formatDate', () => {
    it('should format the date correctly', () => {
      const date = new Date('2024-05-19T12:00:00');

      const formattedDate = stateService.formatDate(date);

      expect(formattedDate).toEqual('19-05-2024');
    });
  });

  it('should search meets by title and update state$', () => {
    const searchTerm = 'test';
    const mockMeets: Meet[] = [
      { id: '1', title: 'Test Meet 1' },
      { id: '2', title: 'Test Meet 2' },
    ] as Meet[];

    repoMeetsService.searchByName.and.returnValue(of(mockMeets));

    stateService.searchMeetsByTitle(searchTerm);

    stateService.getState().subscribe((state) => {
      expect(state.meets).toEqual(mockMeets);
    });

    expect(repoMeetsService.searchByName).toHaveBeenCalledWith(searchTerm);
  });

  it('should fetch and sort users', () => {
    const mockUsers: User[] = [
      { username: 'Charlie', id: '3' } as User,
      { username: 'Alice', id: '1' } as User,
      { username: 'Bob', id: '2' } as User,
    ];
    const sortedUsers: User[] = [
      { username: 'Alice', id: '1' } as User,
      { username: 'Bob', id: '2' } as User,
      { username: 'Charlie', id: '3' } as User,
    ];

    repoUsersService.getUsers.and.returnValue(of(mockUsers));
    const nextSpy = spyOn(stateService['state$'], 'next').and.callThrough();

    stateService.fetchAndSortUsers();

    expect(repoUsersService.getUsers).toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        users: sortedUsers,
      })
    );
  });

  it('should search users by username and update state$', () => {
    const searchTerm = 'test';
    const mockUsers: User[] = [
      { username: 'Alice', id: '1' } as User,
      { username: 'Bob', id: '2' } as User,
    ];

    repoUsersService.searchUserByName.and.returnValue(of(mockUsers));

    stateService.searchUsers(searchTerm);

    stateService.getState().subscribe((state) => {
      expect(state.users).toEqual(mockUsers);
    });

    expect(repoUsersService.searchUserByName).toHaveBeenCalledWith(searchTerm);
  });

  it('should return true if users are friends', () => {
    const friend = {
      id: '2',
    } as User;
    const currentUser = {
      friends: [friend],
    } as unknown as User;

    spyOnProperty(stateService, 'state', 'get').and.returnValue({
      ...stateService.state,
      currentUser: currentUser,
    });

    expect(stateService.isFriend(currentUser, friend.id)).toBeTrue();
  });

  it('should return false if users are not friends', () => {
    const friend = {
      id: '2',
    } as User;
    const currentUser = {
      friends: [
        {
          id: '4',
        },
      ],
    } as unknown as User;

    spyOnProperty(stateService, 'state', 'get').and.returnValue({
      ...stateService.state,
      currentUser: currentUser,
    });

    expect(stateService.isFriend(currentUser, friend.id)).toBeFalse();
  });

  it('should add friend', () => {
    const userId = '1';
    const friend = {
      id: '2',
    } as User;
    const mockUser = {
      id: userId,
      friends: [],
    } as unknown as User;

    repoUsersService.addFriend.and.returnValue(of(mockUser));

    stateService.addFriend(mockUser, friend.id);

    expect(repoUsersService.addFriend).toHaveBeenCalledWith(userId, friend.id);
  });

  it('should delete friend', () => {
    const userId = '1';
    const friend = {
      id: '2',
    } as User;
    const mockUser = {
      id: userId,
      friends: [friend],
    } as unknown as User;

    repoUsersService.deleteFriend.and.returnValue(of([]));

    stateService.deleteFriend(mockUser, friend.id);

    expect(repoUsersService.deleteFriend).toHaveBeenCalledWith(
      userId,
      friend.id
    );
  });
});
