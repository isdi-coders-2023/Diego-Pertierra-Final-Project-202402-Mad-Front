import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StateService, State } from '../core/services/state.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const loggedGuard: CanActivateFn = (_route, _stateRoute) => {
  const stateSrv = inject(StateService);
  const router = inject(Router);
  const userState: State = stateSrv.state;

  if (userState.loginState !== 'logged') {
    console.log('Guard block navigate: LoginState', userState.loginState);
    router.navigate(['/login']);
    return false;
  }

  return true;
};
