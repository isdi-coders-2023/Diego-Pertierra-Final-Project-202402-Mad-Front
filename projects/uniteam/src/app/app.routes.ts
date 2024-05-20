import { Routes } from '@angular/router';
import { loggedGuard } from './guards/logged.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'landing' },
  {
    path: 'landing',
    title: 'Landing',
    loadComponent: () => import('./features/landing/landing.component'),
  },
  {
    path: 'home',
    title: 'Home',
    canActivate: [loggedGuard],
    loadComponent: () => import('./features/home/home.component'),
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./features/login/login.component'),
  },
  {
    path: 'register',
    title: 'Registro',
    loadComponent: () => import('./features/register/register.component'),
  },
  {
    path: 'meets',
    title: 'Quedadas',
    canActivate: [loggedGuard],
    loadComponent: () => import('./features/meets/meets.component'),
  },
  {
    path: 'meets/:id',
    title: 'Quedada',
    canActivate: [loggedGuard],
    loadComponent: () =>
      import('./features/meet-details/meet-details.component'),
  },
  {
    path: 'profile',
    title: 'Perfil',
    canActivate: [loggedGuard],
    loadComponent: () => import('./features/profile/profile.component'),
  },
  {
    path: 'create-meet',
    title: 'Nueva quedada',
    canActivate: [loggedGuard],
    loadComponent: () => import('./features/create-meet/create-meet.component'),
  },
  {
    path: 'error',
    title: 'Error',
    canActivate: [loggedGuard],
    loadComponent: () => import('./features/error/error.component'),
  },
  { path: '**', redirectTo: 'error' },
];
