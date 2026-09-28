import { Routes } from '@angular/router';

import { CaissePage } from './caisse/caisse-page/caisse-page';
import { LoginPage } from './login/login-page/login-page';

// TODO étape 2 : protéger /caisse avec un guard
export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'caisse', component: CaissePage },
  { path: '', redirectTo: 'caisse', pathMatch: 'full' },
  { path: '**', redirectTo: 'caisse' },
];
