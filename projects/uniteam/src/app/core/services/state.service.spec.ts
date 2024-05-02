import { TestBed } from '@angular/core/testing';
import { StateService } from './state.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { routes } from '../../app.routes';

describe('StateService', () => {
  let stateService: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StateService],
    });

    stateService = TestBed.inject(StateService);
  });

  it('should set routes', () => {
    const expectedRoutes = routes
      .filter((route) => route.path !== '**' && route.path !== '')
      .map((route) => ({
        title: route.title as string,
        path: route.path as string,
      }));
    const result = stateService.setRoutes();
    expect(result).toEqual(expectedRoutes);
  });
});
