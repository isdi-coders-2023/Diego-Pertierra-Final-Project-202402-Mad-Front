import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StateService } from '../core/services/state.service';

export const loggedInterceptor: HttpInterceptorFn = (req, next) => {
  const stateService = inject(StateService);
  const { loginState, token } = stateService.state;

  if (loginState !== 'logged') {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
