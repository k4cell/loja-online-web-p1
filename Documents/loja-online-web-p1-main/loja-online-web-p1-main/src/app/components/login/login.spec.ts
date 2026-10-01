import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Login } from './login';
import { AuthService } from '../../model/auth.service';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let tela: HTMLElement;

  const entrar = async (email: string, senha: string) => {
    const campoEmail = tela.querySelector('#email') as HTMLInputElement;
    const campoSenha = tela.querySelector('#senha') as HTMLInputElement;
    campoEmail.value = email;
    campoEmail.dispatchEvent(new Event('input'));
    campoSenha.value = senha;
    campoSenha.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    (tela.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    tela = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('não entra com e-mail fora do formato', async () => {
    await entrar('abc', '12345678');

    expect(TestBed.inject(AuthService).usuario()).toBeNull();
    expect(tela.querySelector('#email')?.classList).toContain('is-invalid');
    expect(tela.querySelector('#senha')?.classList).not.toContain('is-invalid');
  });

  it('não entra com senha curta', async () => {
    await entrar('maria@loja.com', '123');

    expect(TestBed.inject(AuthService).usuario()).toBeNull();
    expect(tela.querySelector('#senha')?.classList).toContain('is-invalid');
  });

  it('entra com dados válidos', async () => {
    await entrar('maria@loja.com', '12345678');

    expect(TestBed.inject(AuthService).usuario()?.email).toBe('maria@loja.com');
  });

  it('abre a janela de esqueci minha senha', async () => {
    expect(tela.querySelector('app-esqueci-senha')).toBeNull();

    const botao = Array.from(tela.querySelectorAll('button')).find(b => b.textContent?.includes('Esqueci')) as HTMLButtonElement;
    botao.click();
    await fixture.whenStable();

    expect(tela.querySelector('app-esqueci-senha')).toBeTruthy();
  });
});
