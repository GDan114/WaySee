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
  },  {
    path: 'conexao-semaforo',
    loadComponent: () => import('./conexao-semaforo/conexao-semaforo.page').then( m => m.ConexaoSemaforoPage)
  },
  {
    path: 'erro-conexao',
    loadComponent: () => import('./erro-conexao/erro-conexao.page').then( m => m.ErroConexaoPage)
  },
  {
    path: 'exito-conexao',
    loadComponent: () => import('./exito-conexao/exito-conexao.page').then( m => m.ExitoConexaoPage)
  },

];
