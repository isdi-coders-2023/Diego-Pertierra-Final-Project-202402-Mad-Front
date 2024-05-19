import { ComponentFixture, TestBed } from '@angular/core/testing';
import RegisterComponent from './register.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RepoUsersService } from '../../core/services/repo.users.service';
import { Router, Routes, provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockRepoUsersService: jasmine.SpyObj<RepoUsersService>;
  let usersService: RepoUsersService;
  let router: Router;

  beforeEach(async () => {
    mockRepoUsersService = jasmine.createSpyObj('RepoUsersService', ['create']);
    //mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        provideRouter([] as Routes),
        FormBuilder,
        { provide: RepoUsersService, useValue: mockRepoUsersService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(RepoUsersService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callThrough();
    mockRepoUsersService.create.and.callFake(() => {
      return of({});
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set avatar control value on file change', () => {
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    spyOn(component.registerForm, 'patchValue');

    const inputElement = document.createElement('input');
    inputElement.type = 'file';

    const fileList = {
      0: file,
      length: 1,
      item: () => file,
    } as FileList;

    Object.defineProperty(inputElement, 'files', { value: fileList });

    component.avatar.nativeElement = inputElement;

    component.onFileChange();
    expect(component.registerForm.patchValue).toHaveBeenCalledWith({
      avatar: file,
    });
  });

  it('should submit form and call service', () => {
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    component.registerForm.setValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password',
      birthDate: '2000-01-01',
      avatar: file,
      location: 'Test Location',
      gender: 'male',
      bio: 'Test bio',
    });

    component.onSubmit();

    expect(usersService.create).toHaveBeenCalledWith(jasmine.any(FormData));

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
