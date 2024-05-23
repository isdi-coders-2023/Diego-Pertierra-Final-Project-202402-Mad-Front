import { Routes } from '@angular/router';

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
    loadComponent: () => import('./features/meets/meets.component'),
  },
  {
    path: 'meets/:id',
    title: 'Quedada',
    loadComponent: () =>
      import('./features/meet-details/meet-details.component'),
  },
  {
    path: 'profile',
    title: 'Perfil',
    loadComponent: () => import('./features/profile/profile.component'),
  },
  {
    path: 'create-meet',
    title: 'Nueva quedada',
    loadComponent: () => import('./features/create-meet/create-meet.component'),
  },
  {
    path: 'error',
    title: 'Error',
    loadComponent: () => import('./features/error/error.component'),
  },
  { path: '**', redirectTo: 'error' },
];
