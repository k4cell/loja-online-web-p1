import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-cadastro',
  styleUrl: './cadastro.css',
  templateUrl: './cadastro.html',
})
export class Cadastro {
  nome: string = '';
  email: string = '';
  senha: string = '';
  confirmaSenha: string = '';
  cpf: string = '';
  telefone: string = '';

  tentou: boolean = false;
  sucesso: boolean = false;

  get senhasDiferentes(): boolean {
    return this.senha !== this.confirmaSenha;
  }

  cadastrar(f: NgForm) {
    this.tentou = true;
    this.sucesso = false;

    if (f.invalid || this.senhasDiferentes) return;

    f.resetForm({ nome: '', email: '', senha: '', confirmaSenha: '', cpf: '', telefone: '' });
    this.tentou = false;
    this.sucesso = true;
  }

  mascarar(campo: NgModel, valor: string, mascara: (valor: string) => string) {
    const formatado = mascara(valor);
    if (formatado !== valor) {
      campo.control.setValue(formatado);
    }
  }

  mascararCpf(valor: string): string {
    const n = (valor ?? '').replace(/\D/g, '').slice(0, 11);
    return n.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  mascararTelefone(valor: string): string {
    const n = (valor ?? '').replace(/\D/g, '').slice(0, 11);
    if (n.length === 0) return '';
    if (n.length <= 2) return `(${n}`;
    if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
    return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
  }
}
