import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CestaService } from '../../model/cesta.service';
import { AuthService } from '../../model/auth.service';
import { Pedido } from '../../model/pedido';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-cesta',
  styleUrl: './cesta.css',
  templateUrl: './cesta.html',
})
export class Cesta {
  cesta = inject(CestaService);
  private auth = inject(AuthService);
  private router = inject(Router);

  pedidoFeito: Pedido | null = null;

  limparCesta() {
    this.cesta.limpar();
  }

  finalizar() {
    const usuario = this.auth.usuario();
    if (!usuario) {
      this.router.navigate(['/login'], { queryParams: { retorno: '/cesta' } });
      return;
    }
    this.pedidoFeito = this.cesta.finalizar(usuario.email);
  }
}
