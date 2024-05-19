import { ComponentFixture, TestBed } from '@angular/core/testing';

import CreateMeetComponent from './create-meet.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { RepoMeetsService } from '../../core/services/repo-meets.service';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

describe('CreateMeetComponent', () => {
  let component: CreateMeetComponent;
  let fixture: ComponentFixture<CreateMeetComponent>;
  let mockRepoMeetsService: jasmine.SpyObj<RepoMeetsService>;
  let router: Router;

  beforeEach(async () => {
    mockRepoMeetsService = jasmine.createSpyObj('RepoMeetsService', ['create']);

    await TestBed.configureTestingModule({
      imports: [CreateMeetComponent, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        FormBuilder,
        { provide: RepoMeetsService, useValue: mockRepoMeetsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateMeetComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callThrough();
    mockRepoMeetsService.create.and.returnValue(of({}));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set avatar control value on file change', () => {
    const file = new File(['image'], 'image.png', { type: 'image/png' });
    spyOn(component.meetForm, 'patchValue');

    const inputElement = document.createElement('input');
    inputElement.type = 'file';

    const fileList = {
      0: file,
      length: 1,
      item: () => file,
    } as FileList;

    Object.defineProperty(inputElement, 'files', { value: fileList });

    component.image.nativeElement = inputElement;

    component.onFileChange();
    expect(component.meetForm.patchValue).toHaveBeenCalledWith({
      image: file,
    });
  });

  it('should submit form and call service', () => {
    const file = new File(['image'], 'image.png', { type: 'image/png' });
    component.meetForm.setValue({
      title: 'testmeet',
      description: 'example',
      image: file,
      location: 'example',
      sport: 'football',
      date: '01-01-1990',
    });

    component.onSubmit();

    expect(mockRepoMeetsService.create).toHaveBeenCalledWith(
      jasmine.any(FormData)
    );

    expect(router.navigate).toHaveBeenCalledWith(['/meets']);
  });
});
