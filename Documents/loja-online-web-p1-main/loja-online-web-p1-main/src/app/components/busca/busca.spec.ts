import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Busca } from './busca';
import { ProdutoService } from '../../model/produto.service';

describe('Busca', () => {
  let component: Busca;
  let fixture: ComponentFixture<Busca>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Busca],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Busca);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sem termo, mostra todos os produtos', () => {
    const total = TestBed.inject(ProdutoService).lista.length;
    expect(component.resultados().length).toBe(total);
  });
});
