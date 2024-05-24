import { ComponentFixture, TestBed } from '@angular/core/testing';

import ProfileComponent from './profile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StateService } from '../../core/services/state.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SubmitBtnComponent } from '../shared/submit-btn/submit-btn.component';
import { InfoModalComponent } from '../shared/info-modal/info-modal.component';
import { ButtonComponent } from '../shared/button/button.component';
import { ConfirmationModalComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let stateServiceMock: StateService;
  let routerMock: Router;

  beforeEach(async () => {
    stateServiceMock = {
      getState: jasmine.createSpy('getState').and.returnValue(
        of({
          currentUser: {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            createdMeets: [],
            joinedMeets: [],
            savedMeets: [],
            friends: [],
            birthDate: '2000-01-01',
            avatar: '',
            location: '',
            bio: '',
          },
        })
      ),
      updateUser: jasmine.createSpy('updateUser').and.returnValue(of({})),
      deleteUser: jasmine.createSpy('deleteUser'),
      formatDate: jasmine.createSpy('formatDate'),
    } as unknown as StateService;

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    } as unknown as Router;

    await TestBed.configureTestingModule({
      imports: [
        ProfileComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        SubmitBtnComponent,
        InfoModalComponent,
        ButtonComponent,
        ConfirmationModalComponent,
      ],
      providers: [
        { provide: StateService, useValue: stateServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with current user data', () => {
    expect(component.profileForm.value.username).toBe('testuser');
    expect(component.profileForm.value.email).toBe('test@example.com');
  });

  it('should call updateUser on form submit', () => {
    component.profileForm.patchValue({
      username: 'newuser',
      email: 'new@example.com',
      password: 'newpassword',
      birthDate: '2000-01-01',
      location: 'newlocation',
      bio: 'newbio',
    });

    component.onSubmit();

    expect(stateServiceMock.updateUser).toHaveBeenCalled();
  });

  it('should show confirmation modal when delete button is clicked', () => {
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    spyOn(component.profileForm, 'patchValue');

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
    expect(component.profileForm.patchValue).toHaveBeenCalledWith({
      avatar: file,
    });
  });

  it('should show confirmation modal when delete button is clicked', () => {
    component.openConfirmationModal();
    expect(component.showConfirmationModal).toBeTrue();
  });

  it('should call deleteUser on delete confirmation', () => {
    component.onDeleteConfirmed('1');
    expect(stateServiceMock.deleteUser).toHaveBeenCalledWith('1');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/landing']);
  });

  it('should hide confirmation modal on cancel delete', () => {
    component.onCancelDelete();
    expect(component.showConfirmationModal).toBeFalse();
  });
});
