import { Injectable, afterNextRender, computed, inject, signal } from '@angular/core';
import { ItemCesta } from './item-cesta';
import { OpcaoProduto } from './opcao-produto';
import { Pedido } from './pedido';
import { Produto } from './produto';
import { ProdutoService } from './produto.service';

@Injectable({ providedIn: 'root' })
export class CestaService {
  private produtos = inject(ProdutoService);

  itens = signal<ItemCesta[]>([]);
  carregada = signal(false);
  quantidade = computed(() => this.itens().reduce((soma, item) => soma + item.quantidade, 0));
  total = computed(() => this.itens().reduce((soma, item) => soma + item.valorTotal, 0));

  constructor() {
    afterNextRender(() => {
      try {
        const json = localStorage.getItem("cesta");
        if (json != null) {
          this.itens.set(this.aproveitar(JSON.parse(json)));
        }
      } catch {
        this.itens.set([]);
      }
      this.carregada.set(true);
    });
  }

  adicionar(obj: Produto, opcao?: OpcaoProduto): boolean {
    const lista = [...this.itens()];
    const existente = lista.find(i => i.produto.codigo === obj.codigo && i.opcao === (opcao?.nome ?? ''));
    if (existente) {
      if (existente.quantidade >= existente.estoque) return false;
      existente.quantidade++;
      existente.valorTotal = existente.valorUnitario * existente.quantidade;
    } else {
      const novo = new ItemCesta(obj, opcao);
      if (novo.estoque < 1) return false;
      lista.push(novo);
    }
    this.salvar(lista);
    return true;
  }

  alterarQuantidade(item: ItemCesta, variacao: number): boolean {
    const lista = [...this.itens()];
    const alvo = lista.find(i => this.mesmaLinha(i, item));
    if (!alvo) return false;
    const nova = alvo.quantidade + variacao;
    if (nova < 1 || nova > alvo.estoque) return false;
    alvo.quantidade = nova;
    alvo.valorTotal = alvo.valorUnitario * nova;
    this.salvar(lista);
    return true;
  }

  remover(item: ItemCesta) {
    this.salvar(this.itens().filter(i => !this.mesmaLinha(i, item)));
  }

  finalizar(email: string): Pedido {
    let pedidos: Pedido[] = [];
    try {
      pedidos = JSON.parse(localStorage.getItem("pedidos") ?? "[]");
    } catch {
      pedidos = [];
    }
    const pedido = new Pedido();
    pedido.numero = pedidos.length + 1;
    pedido.data = new Date().toISOString();
    pedido.email = email;
    pedido.itens = this.itens();
    pedido.total = this.total();
    pedidos.push(pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    this.limpar();
    return pedido;
  }

  limpar() {
    this.salvar([]);
  }

  private mesmaLinha(a: ItemCesta, b: ItemCesta): boolean {
    return a.produto.codigo === b.produto.codigo && a.opcao === b.opcao;
  }

  private aproveitar(salvos: ItemCesta[]): ItemCesta[] {
    return salvos
      .filter(i => this.produtos.buscarPorCodigo(i.produto?.codigo)?.nome === i.produto?.nome)
      .map(i => Object.assign(i, { opcao: i.opcao ?? '', cor: i.cor ?? '', estoque: i.estoque ?? i.produto.estoque }));
  }

  private salvar(lista: ItemCesta[]) {
    this.itens.set(lista);
    if (typeof localStorage === 'undefined') return;
    if (lista.length > 0) {
      localStorage.setItem("cesta", JSON.stringify(lista));
    } else {
      localStorage.removeItem("cesta");
    }
  }
}
