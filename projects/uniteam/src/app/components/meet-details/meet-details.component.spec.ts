import { ComponentFixture, TestBed } from '@angular/core/testing';

import MeetDetailsComponent from './meet-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { Observable, of } from 'rxjs';
import { Meet } from '../../core/models/meet.model';

describe('MeetDetailsComponent', () => {
  let component: MeetDetailsComponent;
  let fixture: ComponentFixture<MeetDetailsComponent>;
  let stateService: StateService;
  let mockActivatedRoute: ActivatedRoute;

  beforeEach(async () => {
    mockActivatedRoute = {
      params: of({ id: '123' }),
    } as unknown as ActivatedRoute;

    await TestBed.configureTestingModule({
      imports: [MeetDetailsComponent, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetDetailsComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(StateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load meet details on ngOnInit', () => {
    const mockMeet = {
      id: '123',
      title: 'Mock Meet',
    } as Meet;
    spyOn(stateService, 'loadMeetById').and.returnValue(of(mockMeet));

    component.ngOnInit();

    expect(component.meetDetails).toEqual({
      id: '123',
      title: 'Mock Meet',
    } as Meet);
  });

  it('should handle error when loading meet details on ngOnInit', () => {
    const errorMessage = 'Failed to load meet';

    spyOn(stateService, 'loadMeetById').and.returnValue(
      new Observable((observer) => {
        observer.error(errorMessage);
      })
    );

    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith(
      'Failed to load meet:',
      errorMessage
    );
  });
});
