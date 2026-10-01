import { TestBed } from '@angular/core/testing';
import { CestaService } from './cesta.service';
import { Produto } from './produto';
import { OpcaoProduto } from './opcao-produto';

describe('CestaService', () => {
  let service: CestaService;

  const produto = (codigo: number, estoque = 3, valorPromo = 0): Produto =>
    Object.assign(new Produto(), { codigo, nome: 'Produto ' + codigo, valor: 10, valorPromo, estoque });

  const cor = (nome: string, estoque = 2): OpcaoProduto =>
    Object.assign(new OpcaoProduto(), { nome, cor: '#d62828', estoque });

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(CestaService);
  });

  it('soma quantidade e total', () => {
    service.adicionar(produto(1));
    service.adicionar(produto(1));
    service.adicionar(produto(2));

    expect(service.itens().length).toBe(2);
    expect(service.quantidade()).toBe(3);
    expect(service.total()).toBe(30);
  });

  it('usa o preço promocional quando existe', () => {
    service.adicionar(produto(1, 3, 7.5));

    expect(service.total()).toBe(7.5);
  });

  it('não passa do estoque', () => {
    const p = produto(1, 2);

    expect(service.adicionar(p)).toBe(true);
    expect(service.adicionar(p)).toBe(true);
    expect(service.adicionar(p)).toBe(false);
    expect(service.quantidade()).toBe(2);
  });

  it('não adiciona produto sem estoque', () => {
    expect(service.adicionar(produto(1, 0))).toBe(false);
    expect(service.itens().length).toBe(0);
  });

  it('altera a quantidade só entre 1 e o estoque', () => {
    service.adicionar(produto(1, 2));
    const item = service.itens()[0];

    expect(service.alterarQuantidade(item, 1)).toBe(true);
    expect(service.alterarQuantidade(item, 1)).toBe(false);
    expect(service.alterarQuantidade(item, -1)).toBe(true);
    expect(service.alterarQuantidade(item, -1)).toBe(false);
    expect(service.quantidade()).toBe(1);
  });

  it('remove um item e limpa a cesta', () => {
    service.adicionar(produto(1));
    service.adicionar(produto(2));

    service.remover(service.itens()[0]);
    expect(service.itens().map(i => i.produto.codigo)).toEqual([2]);

    service.limpar();
    expect(service.itens().length).toBe(0);
    expect(localStorage.getItem('cesta')).toBeNull();
  });

  it('guarda a cesta no localStorage', () => {
    service.adicionar(produto(1));

    const guardada = JSON.parse(localStorage.getItem('cesta') ?? '[]');
    expect(guardada.length).toBe(1);
    expect(guardada[0].produto.codigo).toBe(1);
  });

  it('finalizar grava o pedido e esvazia a cesta', () => {
    service.adicionar(produto(1));
    service.adicionar(produto(1));

    const pedido = service.finalizar('maria@loja.com');

    expect(pedido.numero).toBe(1);
    expect(pedido.total).toBe(20);
    expect(pedido.email).toBe('maria@loja.com');
    expect(service.itens().length).toBe(0);
    expect(JSON.parse(localStorage.getItem('pedidos') ?? '[]').length).toBe(1);
  });

  describe('produtos com opções (cores)', () => {
    it('cores diferentes do mesmo produto ficam em linhas separadas', () => {
      const tinta = produto(1, 4);

      service.adicionar(tinta, cor('Vermelho'));
      service.adicionar(tinta, cor('Azul'));

      expect(service.itens().map(i => i.opcao)).toEqual(['Vermelho', 'Azul']);
      expect(service.quantidade()).toBe(2);
    });

    it('a mesma cor soma na mesma linha', () => {
      const tinta = produto(1, 4);

      service.adicionar(tinta, cor('Vermelho'));
      service.adicionar(tinta, cor('Vermelho'));

      expect(service.itens().length).toBe(1);
      expect(service.itens()[0].quantidade).toBe(2);
      expect(service.itens()[0].cor).toBe('#d62828');
    });

    it('o limite de estoque vale para cada cor', () => {
      const tinta = produto(1, 10);

      expect(service.adicionar(tinta, cor('Vermelho', 1))).toBe(true);
      expect(service.adicionar(tinta, cor('Vermelho', 1))).toBe(false);
      expect(service.adicionar(tinta, cor('Azul', 1))).toBe(true);
    });

    it('não adiciona uma cor sem estoque', () => {
      expect(service.adicionar(produto(1, 5), cor('Amarelo', 0))).toBe(false);
      expect(service.itens().length).toBe(0);
    });

    it('altera e remove só a linha da cor escolhida', () => {
      const tinta = produto(1, 10);
      service.adicionar(tinta, cor('Vermelho', 3));
      service.adicionar(tinta, cor('Azul', 3));
      const vermelho = service.itens()[0];

      service.alterarQuantidade(vermelho, 1);
      expect(service.itens().map(i => i.quantidade)).toEqual([2, 1]);

      service.remover(vermelho);
      expect(service.itens().map(i => i.opcao)).toEqual(['Azul']);
    });
  });
});
