import { ComponentFixture, TestBed } from '@angular/core/testing';

import MeetsComponent from './meets.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { StateService, State } from '../../core/services/state.service';
import { of } from 'rxjs';

describe('MeetsComponent', () => {
  let component: MeetsComponent;
  let fixture: ComponentFixture<MeetsComponent>;
  let stateServiceMock: jasmine.SpyObj<StateService>;

  beforeEach(async () => {
    stateServiceMock = jasmine.createSpyObj('StateService', [
      'getState',
      'setLogout',
      'setRoutes',
      'constructImageUrl',
      'loadMeets',
      'setDeleteCardState',
    ]);

    stateServiceMock.getState.and.returnValue(
      of({
        loginState: 'logged',
        currentUser: { name: 'Test User' },
      } as State)
    );

    stateServiceMock.loadMeets();

    await TestBed.configureTestingModule({
      imports: [MeetsComponent, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        { provide: StateService, useValue: stateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call state service with correct parameter in ngOnInit', () => {
    (stateServiceMock.loadMeets as jasmine.Spy).and.returnValue(of([]));

    component.ngOnInit();

    expect(stateServiceMock.loadMeets).toHaveBeenCalled();
  });
});
