import { Routes } from '@angular/router';
import { SigninComponent } from './layout/signin/signin.component';

export const routes: Routes = [
    {path:'', pathMatch:'full', component:SigninComponent}
];
