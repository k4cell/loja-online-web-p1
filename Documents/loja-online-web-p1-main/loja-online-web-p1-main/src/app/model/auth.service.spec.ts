import { TestBed } from '@angular/core/testing';
import { AuthService, nomeDoEmail } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(AuthService);
  });

  it('entra usando o primeiro nome do e-mail', () => {
    service.entrar('joao@loja.com');

    expect(service.usuario()?.nome).toBe('Joao');
    expect(service.usuario()?.email).toBe('joao@loja.com');
  });

  it('ignora maiúsculas e espaços no e-mail', () => {
    service.entrar('  Maria@Loja.com ');

    expect(service.usuario()?.email).toBe('maria@loja.com');
    expect(service.usuario()?.nome).toBe('Maria');
  });

  it('guarda quem entrou e esquece ao sair', () => {
    service.entrar('maria@loja.com');
    expect(JSON.parse(localStorage.getItem('usuario') ?? '{}').email).toBe('maria@loja.com');

    service.sair();
    expect(service.usuario()).toBeNull();
    expect(localStorage.getItem('usuario')).toBeNull();
  });

  it('não guarda a senha nem lista de clientes', () => {
    service.entrar('maria@loja.com');

    expect(localStorage.getItem('clientes')).toBeNull();
    expect(Object.keys(localStorage)).toEqual(['usuario']);
  });

  it('quem já estava logado também aparece pelo primeiro nome', () => {
    localStorage.setItem('usuario', JSON.stringify({ nome: 'maria.silva', email: 'maria.silva@loja.com' }));
    const outro = TestBed.runInInjectionContext(() => new AuthService());
    TestBed.tick();

    expect(outro.usuario()?.nome).toBe('Maria');
  });
});

describe('nomeDoEmail', () => {
  it('pega só o primeiro nome, com inicial maiúscula', () => {
    expect(nomeDoEmail('maria.silva@loja.com')).toBe('Maria');
    expect(nomeDoEmail('ana_paula@loja.com')).toBe('Ana');
    expect(nomeDoEmail('carlos-souza@loja.com')).toBe('Carlos');
    expect(nomeDoEmail('joao+loja@loja.com')).toBe('Joao');
  });

  it('ignora números depois do nome', () => {
    expect(nomeDoEmail('joao123@loja.com')).toBe('Joao');
    expect(nomeDoEmail('maria2024.silva@loja.com')).toBe('Maria');
  });

  it('usa o e-mail inteiro quando não há letras para virar nome', () => {
    expect(nomeDoEmail('2024@loja.com')).toBe('2024');
    expect(nomeDoEmail('a@loja.com')).toBe('A');
  });
});
