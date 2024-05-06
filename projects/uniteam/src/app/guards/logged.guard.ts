import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { StateService, UserState } from '../core/services/state.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const loggedGuard: CanActivateFn = (_route, _stateRoute) => {
  const stateSrv = inject(StateService);
  const userState: UserState = stateSrv.userState;

  if (userState.loginState !== 'logged') {
    console.log('Guard block navigate: LoginState', userState.loginState);
    return false;
  }

  return true;
};
