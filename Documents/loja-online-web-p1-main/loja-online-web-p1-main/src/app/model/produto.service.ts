import { Injectable } from '@angular/core';
import { Produto } from './produto';
import { GrupoOpcoes } from './opcao-produto';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  lista: Produto[] = [
    {
      "codigo": 1,
      "nome": "Tinta Acrílica Fosca 250ml",
      "descritivo": "Tinta acrílica fosca de super cobertura e secagem rápida. Serve para tela, madeira, papel e artesanato.",
      "valor": 24.90,
      "valorPromo": 21.90,
      "estoque": 40,
      "destaque": 1
    },
    {
      "codigo": 2,
      "nome": "Tinta Guache 15ml",
      "descritivo": "Tinta guache de cores vivas e acabamento opaco, solúvel em água. Ideal para estudo e ilustração.",
      "valor": 6.50,
      "valorPromo": 0,
      "estoque": 60,
      "destaque": 0
    },
    {
      "codigo": 3,
      "nome": "Tinta a Óleo 37ml",
      "descritivo": "Tinta a óleo com alta concentração de pigmento, para pintura sobre tela com brilho e profundidade.",
      "valor": 19.90,
      "valorPromo": 17.90,
      "estoque": 40,
      "destaque": 0
    },
    {
      "codigo": 4,
      "nome": "Tinta para Tecido 37ml",
      "descritivo": "Tinta para pintura em tecido, não desbota com a lavagem depois de fixada.",
      "valor": 9.90,
      "valorPromo": 0,
      "estoque": 100,
      "destaque": 0
    },
    {
      "codigo": 5,
      "nome": "Aquarela em Pastilhas 12 Cores",
      "descritivo": "Estojo com 12 pastilhas de aquarela, pincel e espaço para misturar as cores.",
      "valor": 49.90,
      "valorPromo": 44.90,
      "estoque": 18,
      "destaque": 1
    },
    {
      "codigo": 6,
      "nome": "Kit Marcador Brush Pen 6 Cores",
      "descritivo": "Kit com 6 marcadores brush pen aquareláveis em cores sortidas. A ponta de pincel flexível é ótima para lettering, ilustração e aquarela.",
      "valor": 39.90,
      "valorPromo": 34.90,
      "estoque": 30,
      "destaque": 0
    },
    {
      "codigo": 7,
      "nome": "Pincel Chato Sintético nº 6",
      "descritivo": "Pincel chato de cerdas sintéticas macias, bom para tintas acrílicas e guache.",
      "valor": 8.90,
      "valorPromo": 0,
      "estoque": 35,
      "destaque": 0
    },
    {
      "codigo": 8,
      "nome": "Pincel Redondo Pelo de Marta nº 2",
      "descritivo": "Pincel redondo de pelo de marta com ponta fina, feito para detalhes e aquarela.",
      "valor": 27.90,
      "valorPromo": 0,
      "estoque": 14,
      "destaque": 0
    },
    {
      "codigo": 9,
      "nome": "Kit com 5 Pincéis Sintéticos",
      "descritivo": "Kit com 5 pincéis de formatos e tamanhos diferentes para quem está começando.",
      "valor": 34.90,
      "valorPromo": 29.90,
      "estoque": 22,
      "destaque": 1
    },
    {
      "codigo": 10,
      "nome": "Tela para Pintura 30x40cm",
      "descritivo": "Tela de algodão com chassi de madeira e base pronta para pintar.",
      "valor": 24.90,
      "valorPromo": 0,
      "estoque": 40,
      "destaque": 0
    },
    {
      "codigo": 11,
      "nome": "Tela para Pintura 50x70cm",
      "descritivo": "Tela grande de algodão com chassi reforçado, para obras de maior formato.",
      "valor": 59.90,
      "valorPromo": 52.90,
      "estoque": 16,
      "destaque": 1
    },
    {
      "codigo": 12,
      "nome": "Bloco de Papel para Aquarela A4 300g",
      "descritivo": "Bloco com 12 folhas de papel de alta gramatura (300 g/m²) que não ondula com a água.",
      "valor": 32.90,
      "valorPromo": 0,
      "estoque": 25,
      "destaque": 0
    },
    {
      "codigo": 13,
      "nome": "Sketchbook A3 120g",
      "descritivo": "Caderno de desenho com capa dura e 50 folhas, para estudos, esboços e rascunhos.",
      "valor": 28.90,
      "valorPromo": 24.90,
      "estoque": 30,
      "destaque": 0
    },
    {
      "codigo": 14,
      "nome": "Lápis de Cor 24 Cores",
      "descritivo": "Estojo com 24 lápis de cor macios e pigmentados, com boa mistura e sobreposição.",
      "valor": 39.90,
      "valorPromo": 34.90,
      "estoque": 35,
      "destaque": 1
    },
    {
      "codigo": 15,
      "nome": "Kit de Lápis Grafite com 4 Graduações",
      "descritivo": "Kit com 4 lápis grafite (HB, 2B, 4B e 6B) para sombreamento, traço e estudo de luz e sombra.",
      "valor": 18.90,
      "valorPromo": 0,
      "estoque": 50,
      "destaque": 0
    }
  ];

  private opcoes = new Map<number, GrupoOpcoes>([
    [1, { titulo: 'Cor', opcoes: [
      { nome: 'Branco Titânio', cor: '#FFFFFF', estoque: 40 },
      { nome: 'Preto Fosco', cor: '#1B1B1B', estoque: 35 },
      { nome: 'Amarelo Limão', cor: '#F4E04D', estoque: 0 },
      { nome: 'Amarelo Ouro', cor: '#E1A91C', estoque: 18 },
      { nome: 'Laranja', cor: '#F08A24', estoque: 12 },
      { nome: 'Vermelho Carmim', cor: '#B3202A', estoque: 20 },
      { nome: 'Rosa Pink', cor: '#E0559B', estoque: 9 },
      { nome: 'Violeta', cor: '#6B3FA0', estoque: 14 },
      { nome: 'Azul Cobalto', cor: '#2350A8', estoque: 25 },
      { nome: 'Azul Turquesa', cor: '#2BA6B5', estoque: 16 },
      { nome: 'Verde Folha', cor: '#3E8E41', estoque: 22 },
      { nome: 'Terra de Siena', cor: '#8B4A2B', estoque: 11 },
    ] }],
    [2, { titulo: 'Cor', opcoes: [
      { nome: 'Branco', cor: '#FFFFFF', estoque: 30 },
      { nome: 'Preto', cor: '#1B1B1B', estoque: 28 },
      { nome: 'Amarelo', cor: '#F7D23E', estoque: 24 },
      { nome: 'Vermelho', cor: '#D62828', estoque: 26 },
      { nome: 'Azul', cor: '#2B59C3', estoque: 22 },
      { nome: 'Verde', cor: '#2E9E5B', estoque: 20 },
      { nome: 'Laranja', cor: '#F28C28', estoque: 18 },
      { nome: 'Marrom', cor: '#6F4E37', estoque: 15 },
    ] }],
    [3, { titulo: 'Cor', opcoes: [
      { nome: 'Branco de Titânio', cor: '#FFFFFF', estoque: 20 },
      { nome: 'Preto de Marfim', cor: '#231F20', estoque: 18 },
      { nome: 'Amarelo de Cádmio', cor: '#F3C623', estoque: 12 },
      { nome: 'Vermelho de Cádmio', cor: '#C8102E', estoque: 14 },
      { nome: 'Azul da Prússia', cor: '#0B3C5D', estoque: 10 },
      { nome: 'Verde Esmeralda', cor: '#157A5B', estoque: 9 },
      { nome: 'Ocre Amarelo', cor: '#CC9A3C', estoque: 8 },
      { nome: 'Sombra Natural', cor: '#5C4632', estoque: 11 },
    ] }],
    [4, { titulo: 'Cor', opcoes: [
      { nome: 'Branco', cor: '#FFFFFF', estoque: 25 },
      { nome: 'Preto', cor: '#1B1B1B', estoque: 25 },
      { nome: 'Vermelho', cor: '#D62828', estoque: 18 },
      { nome: 'Azul Royal', cor: '#1F3FAF', estoque: 15 },
      { nome: 'Verde Bandeira', cor: '#1E8C3A', estoque: 14 },
      { nome: 'Amarelo Ouro', cor: '#E1A91C', estoque: 16 },
    ] }],
  ]);

  constructor() {
    this.opcoes.forEach((grupo, codigo) => {
      const produto = this.buscarPorCodigo(codigo);
      if (produto) {
        produto.estoque = grupo.opcoes.reduce((soma, o) => soma + o.estoque, 0);
      }
    });
  }

  opcoesDe(codigo: number): GrupoOpcoes | undefined {
    return this.opcoes.get(codigo);
  }

  buscarPorCodigo(codigo: number): Produto | undefined {
    return this.lista.find(p => p.codigo === codigo);
  }

  buscar(termo: string): Produto[] {
    const normalizar = (t: string) =>
      t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
        .replace(/eis\b/g, 'el').replace(/(\w{3,})s\b/g, '$1');

    const palavras = normalizar(termo.trim()).split(/\s+/).filter(p => p !== '');
    if (palavras.length === 0) return this.lista;

    return this.lista.filter(p => {
      const opcoes = (this.opcoes.get(p.codigo)?.opcoes ?? []).map(o => o.nome);
      const texto = normalizar([p.nome, p.descritivo, ...opcoes].join(' '));
      return palavras.every(palavra => texto.includes(palavra));
    });
  }
}
