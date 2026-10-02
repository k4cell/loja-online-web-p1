import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Produto } from '../../model/produto';
import { OpcaoProduto } from '../../model/opcao-produto';
import { ProdutoService } from '../../model/produto.service';
import { CestaService } from '../../model/cesta.service';
import { fotoIndisponivel } from '../../model/foto';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-detalhe',
  styleUrl: './detalhe.css',
  templateUrl: './detalhe.html',
})
export class Detalhe {
  private produtos = inject(ProdutoService);
  private cesta = inject(CestaService);
  private router = inject(Router);

  private codigo = toSignal(
    inject(ActivatedRoute).paramMap.pipe(map(params => Number(params.get('codigo')))),
    { requireSync: true }
  );
  obj = computed(() => this.produtos.buscarPorCodigo(this.codigo()));

  grupo = computed(() => this.produtos.opcoesDe(this.codigo()));
  private escolha = signal<{ codigo: number, nome: string } | null>(null);
  private tentouComprar = signal<number | null>(null);
  opcaoEscolhida = computed(() => {
    const escolha = this.escolha();
    if (!escolha || escolha.codigo !== this.codigo()) return undefined;
    return this.grupo()?.opcoes.find(o => o.nome === escolha.nome);
  });
  faltaEscolher = computed(() => this.tentouComprar() === this.codigo() && !this.opcaoEscolhida());

  fotoIndisponivel = fotoIndisponivel;

  escolher(opcao: OpcaoProduto) {
    this.escolha.set({ codigo: this.codigo(), nome: opcao.nome });
  }

  adicionarCesta(obj: Produto) {
    if (this.grupo() && !this.opcaoEscolhida()) {
      this.tentouComprar.set(this.codigo());
      return;
    }
    this.cesta.adicionar(obj, this.opcaoEscolhida());
    this.router.navigate(['/cesta']);
  }
}
