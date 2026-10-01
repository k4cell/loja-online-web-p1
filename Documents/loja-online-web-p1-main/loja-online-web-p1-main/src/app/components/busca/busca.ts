import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ProdutoService } from '../../model/produto.service';
import { ProdutoCard } from '../produto-card/produto-card';

@Component({
  selector: 'app-busca',
  imports: [CommonModule, ProdutoCard],
  styleUrl: './busca.css',
  templateUrl: './busca.html',
})
export class Busca {
  private service = inject(ProdutoService);

  termo = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(map(params => params.get('q') ?? '')),
    { requireSync: true }
  );
  resultados = computed(() => this.service.buscar(this.termo()));
}
