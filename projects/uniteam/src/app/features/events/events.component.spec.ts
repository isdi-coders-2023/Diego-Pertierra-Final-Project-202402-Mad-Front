import { ComponentFixture, TestBed } from '@angular/core/testing';

import EventsComponent from './events.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { StateService, UserState } from '../../core/services/state.service';
import { of } from 'rxjs';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  let stateServiceMock: jasmine.SpyObj<StateService>;

  beforeEach(async () => {
    stateServiceMock = jasmine.createSpyObj('StateService', [
      'getUserState',
      'setLogout',
      'setRoutes',
      'constructImageUrl',
      'getEvents',
    ]);

    stateServiceMock.getUserState.and.returnValue(
      of({
        loginState: 'logged',
        currentUser: { name: 'Test User' },
      } as UserState)
    );

    stateServiceMock.getEvents.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [EventsComponent, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        { provide: StateService, useValue: stateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call state service with correct parameter in ngOnInit', () => {
    (stateServiceMock.getEvents as jasmine.Spy).and.returnValue(of([]));

    component.ngOnInit();

    expect(stateServiceMock.getEvents).toHaveBeenCalled();
  });
});
