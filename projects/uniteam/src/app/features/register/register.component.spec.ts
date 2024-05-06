import { ComponentFixture, TestBed } from '@angular/core/testing';
import RegisterComponent from './register.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RepoUsersService } from '../../core/services/repo.users.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockRepoUsersService: jasmine.SpyObj<RepoUsersService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRepoUsersService = jasmine.createSpyObj('RepoUsersService', ['create']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        FormBuilder,
        { provide: RepoUsersService, useValue: mockRepoUsersService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

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
      birthDateString: '2000-01-01',
      avatar: file,
      location: 'Test Location',
      gender: 'male',
      bio: 'Test bio',
    });

    component.onSubmit();

    expect(mockRepoUsersService.create).toHaveBeenCalledWith(
      jasmine.any(FormData)
    );

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
