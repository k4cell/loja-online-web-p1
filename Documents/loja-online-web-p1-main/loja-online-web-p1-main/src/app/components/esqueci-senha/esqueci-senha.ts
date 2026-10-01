import { Component, ElementRef, HostListener, afterNextRender, output, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-esqueci-senha',
  styleUrl: './esqueci-senha.css',
  templateUrl: './esqueci-senha.html',
})
export class EsqueciSenha {
  fechar = output<void>();
  campo = viewChild<ElementRef<HTMLInputElement>>('campo');

  email: string = '';
  tentou: boolean = false;
  enviado: boolean = false;

  constructor() {
    afterNextRender(() => this.campo()?.nativeElement.focus());
  }

  enviar(f: NgForm) {
    this.tentou = true;
    this.enviado = !f.invalid;
  }

  @HostListener('document:keydown.escape')
  aoApertarEsc() {
    this.fechar.emit();
  }
}
