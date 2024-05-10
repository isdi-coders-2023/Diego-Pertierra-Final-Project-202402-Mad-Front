import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StateService, UserState } from '../../../core/services/state.service';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let stateServiceMock: jasmine.SpyObj<StateService>;

  beforeEach(async () => {
    stateServiceMock = jasmine.createSpyObj('StateService', [
      'setRoutes',
      'getUserState',
      'constructImageUrl',
    ]);
    stateServiceMock.setRoutes.and.returnValue([
      { title: 'Home', path: 'home' }, // Mocked menu options
    ]);
    stateServiceMock.getUserState.and.returnValue(
      of({
        loginState: 'logged',
        currentUser: {
          name: 'Test User',
          avatar: 'path_to_avatar.jpg',
        },
      } as UserState)
    );

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        { provide: StateService, useValue: stateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
