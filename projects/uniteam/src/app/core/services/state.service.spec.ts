import { TestBed } from '@angular/core/testing';
import { StateService } from './state.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RepoUsersService } from './repo.users.service';
import { Observable } from 'rxjs';

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
    // Setup
    const storedToken = 'mockStoredToken';
    localStorage.setItem('TFD', storedToken);
    const setLoginSpy = spyOn(stateService, 'setLogin').and.callThrough();

    // Action
    stateService.setLogin(storedToken);

    // Assertion
    expect(setLoginSpy).toHaveBeenCalledWith(storedToken);
  });

  it('should set login state', () => {
    stateService.setLoginState('logging');
    expect(stateService.userState.loginState).toEqual('logging');
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
});
