import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'rota-gps',
    loadComponent: () => import('./rota-gps/rota-gps.page').then( m => m.RotaGpsPage)
  },

];
