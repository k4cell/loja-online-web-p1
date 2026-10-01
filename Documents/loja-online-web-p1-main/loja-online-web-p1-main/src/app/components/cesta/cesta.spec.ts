import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Cesta } from './cesta';

describe('Cesta', () => {
  let component: Cesta;
  let fixture: ComponentFixture<Cesta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cesta],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Cesta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
