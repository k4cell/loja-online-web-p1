import { Component, inject } from '@angular/core';
import { Produto } from '../../model/produto';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../model/produto.service';
import { ProdutoCard } from '../produto-card/produto-card';

@Component({
  imports: [CommonModule, ProdutoCard],
  selector: 'app-vitrine',
  styleUrl: './vitrine.css',
  templateUrl: './vitrine.html',

})
export class Vitrine {
  lista: Produto[] = inject(ProdutoService).lista;
}
