import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EsqueciSenha } from './esqueci-senha';

describe('EsqueciSenha', () => {
  let component: EsqueciSenha;
  let fixture: ComponentFixture<EsqueciSenha>;
  let tela: HTMLElement;

  const enviarEmail = async (email: string) => {
    const campo = tela.querySelector('input') as HTMLInputElement;
    campo.value = email;
    campo.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    (tela.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsqueciSenha],
    }).compileComponents();

    fixture = TestBed.createComponent(EsqueciSenha);
    component = fixture.componentInstance;
    tela = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('avisa quando o e-mail é inválido', async () => {
    await enviarEmail('abc');

    expect(tela.querySelector('input')?.classList).toContain('is-invalid');
    expect(tela.querySelector('.alert-success')).toBeNull();
  });

  it('confirma o envio quando o e-mail é válido', async () => {
    await enviarEmail('maria@loja.com');

    expect(tela.querySelector('.alert-success')?.textContent).toContain('maria@loja.com');
  });

  it('pede para fechar ao apertar ESC', () => {
    let fechou = false;
    component.fechar.subscribe(() => (fechou = true));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(fechou).toBe(true);
  });
});
