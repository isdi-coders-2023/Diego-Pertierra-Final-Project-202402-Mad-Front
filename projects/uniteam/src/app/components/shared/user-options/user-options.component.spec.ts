import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserOptionsComponent } from './user-options.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StateService } from '../../../core/services/state.service';
import { Location } from '@angular/common';
import { User } from '../../../core/models/user.model';
import { Meet } from '../../../core/models/meet.model';

describe('UserOptionsComponent', () => {
  let component: UserOptionsComponent;
  let fixture: ComponentFixture<UserOptionsComponent>;
  let stateServiceSpy: jasmine.SpyObj<StateService>;
  let locationSpy: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    const userId = 'user_id';
    const meetId = 'meet_id';

    stateServiceSpy = jasmine.createSpyObj('StateService', [
      'hasMeet',
      'joinMeet',
      'leaveMeet',
      'constructImageUrl',
    ]);
    locationSpy = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [UserOptionsComponent, HttpClientTestingModule],
      providers: [
        { provide: StateService, useValue: stateServiceSpy },
        { provide: Location, useValue: locationSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserOptionsComponent);
    component = fixture.componentInstance;
    component.user = { id: userId, avatar: 'avatar_url' } as User;
    component.meetDetails = { id: meetId, attendees: [] } as unknown as Meet;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set hasMeet to true if user is associated with meet', () => {
    stateServiceSpy.hasMeet.and.returnValue(true);

    component.ngOnChanges();

    expect(component.hasMeet).toBe(true);
  });

  it('should navigate back when backClicked is called', () => {
    component.backClicked();

    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('should call joinMeet when onClickJoin is called', () => {
    const userId = 'user_id';
    const meetId = 'meet_id';

    component.onClickJoin();

    expect(stateServiceSpy.joinMeet).toHaveBeenCalledWith(userId, meetId);
  });

  it('should call leaveMeet when onClickLeave is called', () => {
    const userId = 'user_id';
    const meetId = 'meet_id';

    component.onClickLeave();

    expect(stateServiceSpy.leaveMeet).toHaveBeenCalledWith(userId, meetId);
  });
});
