import { Injectable } from '@angular/core';
import { routes } from '../../app.routes';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  setRoutes() {
    return routes
      .filter((route) => route.path !== '**' && route.path !== '')
      .map((route) => ({
        title: route.title as string,
        path: route.path as string,
      }));
  }
}
