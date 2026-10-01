import { Routes } from '@angular/router';
import { Vitrine } from './components/vitrine/vitrine';
import { Busca } from './components/busca/busca';
import { Cesta } from './components/cesta/cesta';
import { Login } from './components/login/login';
import { Cadastro } from './components/cadastro/cadastro';
import { Detalhe } from './components/detalhe/detalhe';

export const routes: Routes = [
  { path: '', component: Vitrine },
  { path: 'busca', component: Busca },
  { path: 'cesta', component: Cesta },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'detalhe/:codigo', component: Detalhe },
];
