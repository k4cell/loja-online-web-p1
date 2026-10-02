import { Component, ElementRef, afterNextRender, computed, inject, input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Produto } from '../../model/produto';
import { CestaService } from '../../model/cesta.service';
import { ProdutoService } from '../../model/produto.service';
import { fotoIndisponivel, semFoto } from '../../model/foto';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-produto-card',
  styleUrl: './produto-card.css',
  templateUrl: './produto-card.html',
})
export class ProdutoCard {
  obj = input.required<Produto>();
  foto = viewChild<ElementRef<HTMLImageElement>>('foto');
  fotoIndisponivel = fotoIndisponivel;

  private cesta = inject(CestaService);
  private produtos = inject(ProdutoService);
  private router = inject(Router);

  grupo = computed(() => this.produtos.opcoesDe(this.obj().codigo));
  amostras = computed(() => (this.grupo()?.opcoes ?? []).filter(o => o.cor).slice(0, 6));

  constructor() {
    afterNextRender(() => {
      const img = this.foto()?.nativeElement;
      if (img && img.complete && img.naturalWidth === 0) semFoto(img);
    });
  }

  comprar() {
    const produto = this.obj();
    if (this.grupo()) {
      this.router.navigate(['/detalhe', produto.codigo]);
      return;
    }
    this.cesta.adicionar(produto);
    this.router.navigate(['/cesta']);
  }
}
