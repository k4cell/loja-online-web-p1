import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Cadastro } from './cadastro';

describe('Cadastro', () => {
  let component: Cadastro;
  let fixture: ComponentFixture<Cadastro>;
  let tela: HTMLElement;

  const preencher = async (id: string, valor: string) => {
    const campo = tela.querySelector('#' + id) as HTMLInputElement;
    campo.value = valor;
    campo.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };

  const preencherTudo = async (email = 'maria@loja.com', confirma = 'Abcd123@') => {
    await preencher('txtNome', 'Maria Silva');
    await preencher('txtEmail', email);
    await preencher('txtSenha', 'Abcd123@');
    await preencher('txtConfirmaSenha', confirma);
    await preencher('txtCPF', '123.456.789-01');
    await preencher('txtTelefone', '(11) 99999-9999');
  };

  const enviar = async () => {
    (tela.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Cadastro],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Cadastro);
    component = fixture.componentInstance;
    tela = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('só mostra os erros depois de enviar, e só nos campos errados', async () => {
    expect(tela.querySelectorAll('.is-invalid').length).toBe(0);

    await enviar();
    expect(tela.querySelectorAll('.is-invalid').length).toBe(6);
    expect(tela.querySelector('.alert-success')).toBeNull();

    await preencher('txtNome', 'Maria Silva');
    expect(tela.querySelectorAll('.is-invalid').length).toBe(5);
    expect(tela.querySelector('.is-valid')).toBeNull();
  });

  it('não aceita e-mail fora do formato', async () => {
    await preencherTudo('abc');
    await enviar();

    expect(tela.querySelector('.alert-success')).toBeNull();
    expect(tela.querySelector('#txtEmail')?.classList).toContain('is-invalid');
  });

  it('não aceita senhas diferentes', async () => {
    await preencherTudo('maria@loja.com', 'Outra123@');
    await enviar();

    expect(tela.querySelector('.alert-success')).toBeNull();
    expect(tela.querySelector('#txtConfirmaSenha')?.classList).toContain('is-invalid');
  });

  it('cadastra com dados válidos e limpa o formulário', async () => {
    await preencherTudo();
    await enviar();

    expect(tela.querySelector('.alert-success')).toBeTruthy();
    expect((tela.querySelector('#txtNome') as HTMLInputElement).value).toBe('');
    expect(tela.querySelectorAll('.is-invalid').length).toBe(0);
  });

  it('não guarda nada no navegador ao cadastrar', async () => {
    await preencherTudo();
    await enviar();

    expect(tela.querySelector('.alert-success')).toBeTruthy();
    expect(localStorage.length).toBe(0);
  });

  it('aceita cadastrar de novo com os mesmos dados', async () => {
    await preencherTudo();
    await enviar();
    await preencherTudo();
    await enviar();

    expect(tela.querySelector('.alert-success')).toBeTruthy();
    expect(tela.querySelector('.alert-danger')).toBeNull();
  });

  it('não deixa letra nem dígito a mais nos campos com máscara', async () => {
    await preencher('txtCPF', '123.456.789-01');
    await preencher('txtCPF', '123.456.789-01a');
    await preencher('txtTelefone', '(11) 99999-8888');
    await preencher('txtTelefone', '(11) 99999-88889');

    expect((tela.querySelector('#txtCPF') as HTMLInputElement).value).toBe('123.456.789-01');
    expect((tela.querySelector('#txtTelefone') as HTMLInputElement).value).toBe('(11) 99999-8888');
    expect(tela.querySelector('#txtCPF')?.classList).not.toContain('ng-invalid');
  });

  it('aplica a máscara de CPF e de telefone', () => {
    expect(component.mascararCpf('12345678901')).toBe('123.456.789-01');
    expect(component.mascararCpf('1234')).toBe('123.4');
    expect(component.mascararTelefone('11999999999')).toBe('(11) 99999-9999');
    expect(component.mascararTelefone('119')).toBe('(11) 9');
  });
});
