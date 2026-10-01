import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Detalhe } from './detalhe';
import { CestaService } from '../../model/cesta.service';
import { ProdutoService } from '../../model/produto.service';

describe('Detalhe', () => {
  let component: Detalhe;
  let fixture: ComponentFixture<Detalhe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detalhe],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Detalhe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sem código na URL, avisa que o produto não foi encontrado', () => {
    const tela = fixture.nativeElement as HTMLElement;
    expect(component.obj()).toBeUndefined();
    expect(tela.textContent).toContain('Produto não encontrado!');
  });
});

describe('Detalhe pela URL /detalhe/:codigo', () => {
  let harness: RouterTestingHarness;
  let tela: HTMLElement;
  let produtos: ProdutoService;
  let cesta: CestaService;

  const abrir = async (codigo: number) => {
    await harness.navigateByUrl('/detalhe/' + codigo, Detalhe);
    tela = harness.routeNativeElement as HTMLElement;
    await harness.fixture.whenStable();
  };
  const botaoComprar = () =>
    Array.from(tela.querySelectorAll('button')).find(b => b.textContent?.includes('Comprar')) as HTMLButtonElement;
  const radios = () => Array.from(tela.querySelectorAll('input[type=radio]')) as HTMLInputElement[];

  const tinta = () => produtos.lista.find(p => produtos.opcoesDe(p.codigo)?.titulo === 'Cor')!;
  const semOpcoes = () => produtos.lista.find(p => !produtos.opcoesDe(p.codigo) && p.estoque > 0)!;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'detalhe/:codigo', component: Detalhe }, { path: 'cesta', children: [] }])],
    });
    harness = await RouterTestingHarness.create();
    produtos = TestBed.inject(ProdutoService);
    cesta = TestBed.inject(CestaService);
  });

  it('abre o produto direto pela URL', async () => {
    const p = semOpcoes();
    await abrir(p.codigo);

    expect(tela.querySelector('h4')?.textContent).toContain(p.nome);
  });

  it('mostra uma opção para cada cor, deixando sem clique as que acabaram', async () => {
    const p = tinta();
    const opcoes = produtos.opcoesDe(p.codigo)!.opcoes;
    await abrir(p.codigo);

    expect(radios().length).toBe(opcoes.length);
    expect(radios().filter(r => r.disabled).length).toBe(opcoes.filter(o => o.estoque <= 0).length);
    expect(tela.querySelectorAll('label .amostra').length).toBe(opcoes.length);
  });

  it('não deixa comprar sem escolher a cor', async () => {
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigate');
    await abrir(tinta().codigo);

    expect(tela.querySelector('[role=alert]')).toBeNull();
    botaoComprar().click();
    await harness.fixture.whenStable();

    expect(tela.querySelector('[role=alert]')?.textContent).toContain('Escolha uma opção de cor');
    expect(cesta.quantidade()).toBe(0);
    expect(navegar).not.toHaveBeenCalled();
  });

  it('compra com a cor escolhida e vai para a cesta', async () => {
    const p = tinta();
    const disponivel = produtos.opcoesDe(p.codigo)!.opcoes.find(o => o.estoque > 0)!;
    await abrir(p.codigo);

    radios().find(r => !r.disabled)!.click();
    await harness.fixture.whenStable();
    expect(tela.textContent).toContain(disponivel.nome);

    botaoComprar().click();
    await harness.fixture.whenStable();

    expect(cesta.itens().length).toBe(1);
    expect(cesta.itens()[0].produto.codigo).toBe(p.codigo);
    expect(cesta.itens()[0].opcao).toBe(disponivel.nome);
    expect(TestBed.inject(Router).url).toBe('/cesta');
  });

  it('produto sem opções compra direto', async () => {
    const p = semOpcoes();
    await abrir(p.codigo);

    expect(radios().length).toBe(0);
    botaoComprar().click();
    await harness.fixture.whenStable();

    expect(cesta.itens()[0].produto.codigo).toBe(p.codigo);
    expect(cesta.itens()[0].opcao).toBe('');
  });

  it('a cor escolhida em um produto não vale para outro', async () => {
    const tintas = produtos.lista.filter(p => produtos.opcoesDe(p.codigo)?.titulo === 'Cor');
    await abrir(tintas[0].codigo);
    radios().find(r => !r.disabled)!.click();
    await harness.fixture.whenStable();

    await abrir(tintas[1].codigo);
    expect(radios().every(r => !r.checked)).toBe(true);
    botaoComprar().click();
    await harness.fixture.whenStable();
    expect(cesta.quantidade()).toBe(0);
  });
});
