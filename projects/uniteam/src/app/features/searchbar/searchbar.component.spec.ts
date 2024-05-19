import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { SearchbarComponent } from './searchbar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StateService } from '../../core/services/state.service';

describe('SearchbarComponent', () => {
  let component: SearchbarComponent;
  let fixture: ComponentFixture<SearchbarComponent>;
  let stateServiceSpy: jasmine.SpyObj<StateService>;

  beforeEach(async () => {
    const stateSpy = jasmine.createSpyObj('StateService', [
      'searchMeetsByTitle',
      'loadMeets',
    ]);

    await TestBed.configureTestingModule({
      imports: [SearchbarComponent, HttpClientTestingModule],
      providers: [{ provide: StateService, useValue: stateSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchbarComponent);
    component = fixture.componentInstance;
    stateServiceSpy = TestBed.inject(
      StateService
    ) as jasmine.SpyObj<StateService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call searchMeetsByTitle when searchTerm is not empty', fakeAsync(() => {
    component.searchTerm = 'Test';
    component.onSearch(new Event('submit'));
    tick();

    expect(stateServiceSpy.searchMeetsByTitle).toHaveBeenCalledWith('Test');
    expect(stateServiceSpy.loadMeets).not.toHaveBeenCalled();
  }));

  it('should emit searchSubmitted event on search', () => {
    const emitSpy = spyOn(component.searchSubmitted, 'emit');

    component.onSearch(new Event('submit'));

    expect(emitSpy).toHaveBeenCalled();
  });
});
