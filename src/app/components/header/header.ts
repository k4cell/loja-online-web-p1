import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CestaService } from '../../model/cesta.service';
import { AuthService } from '../../model/auth.service';

@Component({
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  cesta = inject(CestaService);
  auth = inject(AuthService);
  router = inject(Router);

  termo: string = '';
  menuAberto: boolean = false;
  primeiroNome = computed(() => this.auth.usuario()?.nome.split(' ')[0] ?? '');

  buscar() {
    this.menuAberto = false;
    this.router.navigate(['/busca'], { queryParams: { q: this.termo.trim() } });
  }

  sair() {
    this.auth.sair();
    this.router.navigate(['/']);
  }
}
