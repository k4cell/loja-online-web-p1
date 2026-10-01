import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Header } from './header';
import { CestaService } from '../../model/cesta.service';
import { AuthService } from '../../model/auth.service';
import { Produto } from '../../model/produto';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let tela: HTMLElement;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    tela = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('mostra o nome da loja e leva para a página inicial', () => {
    const marca = tela.querySelector('a.navbar-brand') as HTMLAnchorElement;

    expect(marca.textContent).toContain('Universo das Cores');
    expect(marca.getAttribute('href')).toBe('/');
    expect(marca.querySelector('img')?.getAttribute('src')).toBe('logo-icone.png');
  });

  it('a busca tem botão com ícone de lupa', () => {
    const botao = tela.querySelector('form[role=search] button') as HTMLButtonElement;

    expect(botao.getAttribute('aria-label')).toBe('Buscar');
    expect(botao.querySelector('svg')).toBeTruthy();
    expect(botao.textContent?.trim()).toBe('');
  });

  it('marca o item do menu da página atual', async () => {
    await TestBed.inject(Router).navigateByUrl('/');
    await fixture.whenStable();

    const ativos = Array.from(tela.querySelectorAll('nav.menu a.ativo'));
    expect(ativos.length).toBe(1);
    expect(ativos[0].textContent).toContain('Início');
  });

  it('tem os itens do menu e o acesso à cesta', () => {
    const menu = tela.querySelector('nav.menu') as HTMLElement;
    expect(menu.textContent).toContain('Início');
    expect(menu.textContent).toContain('Cesta');
    expect(menu.querySelector('a[href="/cesta"]')).toBeTruthy();
  });

  it('mostra quantos itens há na cesta', async () => {
    const produto = Object.assign(new Produto(), { codigo: 1, nome: 'Teste', valor: 10, estoque: 5 });
    TestBed.inject(CestaService).adicionar(produto);
    TestBed.inject(CestaService).adicionar(produto);
    await fixture.whenStable();

    expect(tela.querySelector('nav.menu .badge')?.textContent).toContain('2');
  });

  it('mostra o nome de quem entrou e permite sair', async () => {
    TestBed.inject(AuthService).entrar('maria@loja.com');
    await fixture.whenStable();
    expect(tela.querySelector('nav.menu')?.textContent).toContain('Olá, Maria');

    (tela.querySelector('button.sair') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(tela.querySelector('nav.menu')?.textContent).toContain('Entrar');
  });
});
