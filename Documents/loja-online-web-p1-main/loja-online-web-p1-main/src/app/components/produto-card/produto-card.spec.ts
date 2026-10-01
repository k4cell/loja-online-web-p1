import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ProdutoCard } from './produto-card';
import { Produto } from '../../model/produto';
import { CestaService } from '../../model/cesta.service';
import { ProdutoService } from '../../model/produto.service';

registerLocaleData(localePt);

describe('ProdutoCard', () => {
  let fixture: ComponentFixture<ProdutoCard>;
  let tela: HTMLElement;

  const mostrar = async (dados: Partial<Produto>) => {
    const produto = Object.assign(new Produto(), { codigo: 9001, nome: 'Martelo', valor: 39.9, valorPromo: 0, estoque: 5 }, dados);
    fixture.componentRef.setInput('obj', produto);
    await fixture.whenStable();
  };

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ProdutoCard],
      providers: [provideRouter([]), { provide: LOCALE_ID, useValue: 'pt-BR' }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoCard);
    tela = fixture.nativeElement as HTMLElement;
  });

  it('mostra nome e preço em reais', async () => {
    await mostrar({});

    expect(tela.textContent).toContain('Martelo');
    expect(tela.textContent).toContain('39,90');
  });

  it('mostra o preço antigo e o promocional', async () => {
    await mostrar({ valorPromo: 34.9 });

    expect(tela.querySelector('s')?.textContent).toContain('39,90');
    expect(tela.textContent).toContain('34,90');
  });

  it('tem botão Comprar quando há estoque', async () => {
    await mostrar({});

    expect(tela.querySelector('button')?.textContent).toContain('Comprar');
    expect(tela.textContent).not.toContain('Indisponível');
  });

  it('avisa que está indisponível quando não há estoque', async () => {
    await mostrar({ estoque: 0 });

    expect(tela.querySelector('button')).toBeNull();
    expect(tela.textContent).toContain('Indisponível');
  });

  it('o link da foto abre /detalhe/codigo', async () => {
    await mostrar({ codigo: 7 });

    expect(tela.querySelector('a')?.getAttribute('href')).toBe('/detalhe/7');
  });

  it('produto comum vai direto para a cesta', async () => {
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    await mostrar({});

    (tela.querySelector('button') as HTMLButtonElement).click();

    expect(TestBed.inject(CestaService).quantidade()).toBe(1);
    expect(navegar).toHaveBeenCalledWith(['/cesta']);
  });

  describe('produto com opções (cores)', () => {
    const tinta = () => {
      const produtos = TestBed.inject(ProdutoService);
      return produtos.lista.find(p => produtos.opcoesDe(p.codigo)?.titulo === 'Cor')!;
    };

    it('aparece uma vez só, mostrando quantas cores tem', async () => {
      const p = tinta();
      const total = TestBed.inject(ProdutoService).opcoesDe(p.codigo)!.opcoes.length;
      await mostrar(p);

      expect(tela.querySelectorAll('img').length).toBe(1);
      expect(tela.querySelector('.opcoes')?.textContent).toContain(`${total} opções de cor`);
      expect(tela.querySelectorAll('.opcoes .amostra').length).toBeGreaterThan(0);
    });

    it('Comprar leva ao detalhe para escolher a cor e não põe nada na cesta', async () => {
      const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      const p = tinta();
      await mostrar(p);

      (tela.querySelector('button') as HTMLButtonElement).click();

      expect(navegar).toHaveBeenCalledWith(['/detalhe', p.codigo]);
      expect(TestBed.inject(CestaService).quantidade()).toBe(0);
    });
  });
});
