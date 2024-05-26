import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'landing' },
  {
    path: 'landing',
    title: 'Landing',
    loadComponent: () => import('./components/landing/landing.component'),
  },
  {
    path: 'home',
    title: 'Home',
    loadComponent: () => import('./components/home/home.component'),
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./components/login/login.component'),
  },
  {
    path: 'register',
    title: 'Registro',
    loadComponent: () => import('./components/register/register.component'),
  },
  {
    path: 'meets',
    title: 'Quedadas',
    loadComponent: () => import('./components/meets/meets.component'),
  },
  {
    path: 'meets/:id',
    title: 'Quedada',
    loadComponent: () =>
      import('./components/meet-details/meet-details.component'),
  },
  {
    path: 'profile',
    title: 'Perfil',
    loadComponent: () => import('./components/profile/profile.component'),
  },
  {
    path: 'create-meet',
    title: 'Nueva quedada',
    loadComponent: () =>
      import('./components/create-meet/create-meet.component'),
  },
  {
    path: 'error',
    title: 'Error',
    loadComponent: () => import('./components/error/error.component'),
  },
  { path: '**', redirectTo: 'error' },
];
