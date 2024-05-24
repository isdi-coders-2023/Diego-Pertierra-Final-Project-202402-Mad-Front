import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetCardComponent } from './meet-card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { State, StateService } from '../../core/services/state.service';
import { of } from 'rxjs';

describe('MeetCardComponent', () => {
  let component: MeetCardComponent;
  let fixture: ComponentFixture<MeetCardComponent>;
  let stateServiceMock: jasmine.SpyObj<StateService>;

  beforeEach(async () => {
    stateServiceMock = jasmine.createSpyObj('StateService', ['getState']);

    stateServiceMock.getState.and.returnValue(
      of({
        loginState: 'logged',
      } as unknown as State)
    );

    await TestBed.configureTestingModule({
      imports: [MeetCardComponent, HttpClientTestingModule],
      providers: [{ provide: StateService, useValue: stateServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to meet details when goToDetails is called', () => {
    const id = '123';
    const routerSpy = spyOn(component.router, 'navigate').and.stub();

    component.goToDetails(id);

    expect(routerSpy).toHaveBeenCalledWith(['/meets' + '/' + id]);
  });
});
