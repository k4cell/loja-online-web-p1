import { TestBed } from '@angular/core/testing';
import { ProdutoService } from './produto.service';
import { Produto } from './produto';

describe('ProdutoService', () => {
  let service: ProdutoService;

  beforeEach(() => {
    service = TestBed.inject(ProdutoService);
  });

  it('busca sem ligar para acento ou maiúscula', () => {
    const primeiro = service.lista[0];
    const semAcento = primeiro.nome.normalize('NFD').replace(/[̀-ͯ]/g, '');

    expect(service.buscar(primeiro.nome.toUpperCase()).map(p => p.codigo)).toContain(primeiro.codigo);
    expect(service.buscar(semAcento.toLowerCase()).map(p => p.codigo)).toContain(primeiro.codigo);
  });

  it('acha no plural e no singular', () => {
    service.lista = [
      Object.assign(new Produto(), { codigo: 1, nome: 'Kit com 5 Pincéis Sintéticos', descritivo: 'Pincéis variados' }),
      Object.assign(new Produto(), { codigo: 2, nome: 'Tinta Acrílica', descritivo: 'Tinta fosca' }),
    ];

    expect(service.buscar('pincel').map(p => p.codigo)).toEqual([1]);
    expect(service.buscar('pincéis').map(p => p.codigo)).toEqual([1]);
    expect(service.buscar('tintas').map(p => p.codigo)).toEqual([2]);
  });

  it('com várias palavras, todas precisam aparecer, em qualquer ordem', () => {
    service.lista = [
      Object.assign(new Produto(), { codigo: 1, nome: 'Nível de Alumínio 40cm', descritivo: 'Nível com bolhas' }),
      Object.assign(new Produto(), { codigo: 2, nome: 'Trena de Alumínio', descritivo: 'Trena 5 metros' }),
    ];

    expect(service.buscar('nivel aluminio').map(p => p.codigo)).toEqual([1]);
    expect(service.buscar('aluminio nivel').map(p => p.codigo)).toEqual([1]);
    expect(service.buscar('aluminio').map(p => p.codigo)).toEqual([1, 2]);
    expect(service.buscar('nivel trena').length).toBe(0);
  });

  it('não acha produto que não existe', () => {
    expect(service.buscar('zzzzzzzz').length).toBe(0);
  });

  it('sem termo devolve todos os produtos', () => {
    expect(service.buscar('  ').length).toBe(service.lista.length);
  });

  it('acha o produto pelo código', () => {
    const primeiro = service.lista[0];

    expect(service.buscarPorCodigo(primeiro.codigo)?.nome).toBe(primeiro.nome);
    expect(service.buscarPorCodigo(9999)).toBeUndefined();
  });

  it('não repete código: cada produto tem uma foto só', () => {
    const codigos = service.lista.map(p => p.codigo);

    expect(new Set(codigos).size).toBe(codigos.length);
  });

  describe('produtos com opções (cores)', () => {
    const comOpcoes = () => service.lista.filter(p => service.opcoesDe(p.codigo));

    it('há produtos com opções, e elas aparecem uma vez só na lista', () => {
      expect(comOpcoes().length).toBeGreaterThan(0);
      for (const p of comOpcoes()) {
        expect(service.lista.filter(outro => outro.nome === p.nome).length).toBe(1);
      }
    });

    it('o estoque do produto é a soma do estoque das opções', () => {
      for (const p of comOpcoes()) {
        const soma = service.opcoesDe(p.codigo)!.opcoes.reduce((total, o) => total + o.estoque, 0);
        expect(p.estoque).toBe(soma);
      }
    });

    it('as opções de cor têm a cor da bolinha em formato hexadecimal', () => {
      const cores = comOpcoes()
        .map(p => service.opcoesDe(p.codigo)!)
        .filter(g => g.titulo === 'Cor')
        .flatMap(g => g.opcoes);

      expect(cores.length).toBeGreaterThan(0);
      for (const o of cores) {
        expect(o.cor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    });

    it('acha o produto pelo nome de uma das opções', () => {
      const produto = comOpcoes()[0];
      const opcao = service.opcoesDe(produto.codigo)!.opcoes[0];

      expect(service.buscar(opcao.nome).map(p => p.codigo)).toContain(produto.codigo);
    });

    it('acha pelo nome do produto junto com a opção (ex.: "tinta azul")', () => {
      const produto = comOpcoes()[0];
      const opcao = service.opcoesDe(produto.codigo)!.opcoes[0];
      const primeiraPalavra = produto.nome.split(' ')[0];

      expect(service.buscar(primeiraPalavra + ' ' + opcao.nome).map(p => p.codigo)).toContain(produto.codigo);
    });

    it('produto sem opções devolve undefined', () => {
      expect(service.opcoesDe(9999)).toBeUndefined();
    });
  });
});
