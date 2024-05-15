import { TestBed } from '@angular/core/testing';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';

import { loggedInterceptor } from './logged.interceptor';
import { StateService } from '../core/services/state.service';
import { Observable } from 'rxjs';

describe('loggedInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => loggedInterceptor(req, next));

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('Given the login state is logged', () => {
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

    it('should call next with the Authorization header', () => {
      const mockReq = { clone: () => {} } as HttpRequest<unknown>;
      const mockNext: HttpHandlerFn = (mockReq) => {
        return mockReq as unknown as Observable<HttpEvent<unknown>>;
      };
      spyOn(mockReq, 'clone').and.returnValue({} as HttpRequest<unknown>);
      interceptor(mockReq, mockNext);
    });
  });

  describe('Given the login state is not logged', () => {
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

    it('should call next with the original req', () => {
      const mockReq = { clone: () => {} } as HttpRequest<unknown>;
      const mockNext: HttpHandlerFn = (mockReq) => {
        return mockReq as unknown as Observable<HttpEvent<unknown>>;
      };
      interceptor(mockReq, mockNext);
    });
  });
});
