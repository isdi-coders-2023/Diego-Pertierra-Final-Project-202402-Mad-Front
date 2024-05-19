import { ComponentFixture, TestBed } from '@angular/core/testing';
import LoginComponent from './login.component';
import { StateService } from '../../core/services/state.service';
import { Observable, of } from 'rxjs';
import { RepoUsersService } from '../../core/services/repo.users.service';
import { Router, provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let repoUsersServiceMock: jasmine.SpyObj<RepoUsersService>;
  let stateServiceMock: jasmine.SpyObj<StateService>;
  let router: Router;

  beforeEach(async () => {
    repoUsersServiceMock = jasmine.createSpyObj('RepoUsersService', ['login']);
    stateServiceMock = jasmine.createSpyObj('StateService', [
      'setLogin',
      'setLoginState',
    ]);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        {
          provide: StateService,
          useValue: stateServiceMock,
        },
        {
          provide: RepoUsersService,
          useValue: repoUsersServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "/home" after successful login', () => {
    const token = 'test-token';
    repoUsersServiceMock.login.and.returnValue(of({ token }));

    component.formLogin.setValue({
      user: 'testUser',
      password: 'testPassword',
    });
    component.submit();

    expect(repoUsersServiceMock.login).toHaveBeenCalledOnceWith({
      username: 'testUser',
      password: 'testPassword',
    });
    expect(stateServiceMock.setLogin).toHaveBeenCalledOnceWith(token);
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should set login state to "error" if login fails', () => {
    const error = new Error('Login failed');
    repoUsersServiceMock.login.and.returnValue(
      new Observable((observer) => {
        observer.error(error);
      })
    );

    component.formLogin.setValue({
      user: 'testUser',
      password: 'testPassword',
    });
    component.submit();

    expect(repoUsersServiceMock.login).toHaveBeenCalledOnceWith({
      username: 'testUser',
      password: 'testPassword',
    });
    expect(stateServiceMock.setLoginState).toHaveBeenCalledWith('error');
  });

  it('should pass email as part of login data if provided username is an email', () => {
    const token = 'test-token';
    repoUsersServiceMock.login.and.returnValue(of({ token }));

    component.formLogin.setValue({
      user: 'test@example.com',
      password: 'testPassword',
    });
    component.submit();

    expect(repoUsersServiceMock.login).toHaveBeenCalledOnceWith({
      email: 'test@example.com',
      password: 'testPassword',
    });
    expect(stateServiceMock.setLogin).toHaveBeenCalledWith(token);
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
});
