import { Routes } from '@angular/router';
import { SigninComponent } from './layout/signin/signin.component';
import { authGuard } from 'lib';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: SigninComponent },
  {
    path: 'home',
    loadComponent: () =>
      import('./feature/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];