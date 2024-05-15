import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { loggedGuard } from './logged.guard';
import { StateService } from '../core/services/state.service';

describe('loggedGuard', () => {
  const executeGuard: CanActivateFn = (_route, _stateRoute) =>
    TestBed.runInInjectionContext(() => loggedGuard(_route, _stateRoute));

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  describe('Given the loginState is logged', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: StateService,
            useValue: {
              state: {
                loginState: 'logged',
                token: 'token',
              },
            },
          },
        ],
      });
    });

    it('should return true', () => {
      const route = {} as ActivatedRouteSnapshot;
      const stateRoute = {} as RouterStateSnapshot;
      expect(executeGuard(route, stateRoute)).toEqual(true);
    });
  });

  describe('Given the loginState is not logged', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: StateService,
            useValue: {
              state: {
                loginState: 'idle',
                token: 'token',
              },
            },
          },
        ],
      });
    });

    it('should be created', () => {
      expect(executeGuard).toBeTruthy();
    });

    it('should return false', () => {
      const route = {} as ActivatedRouteSnapshot;
      const stateRoute = {} as RouterStateSnapshot;
      expect(executeGuard(route, stateRoute)).toBe(false);
    });
  });
});
