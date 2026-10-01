import { Injectable, afterNextRender, signal } from '@angular/core';

export interface Usuario {
  nome: string;
  email: string;
}

export function nomeDoEmail(email: string): string {
  const prefixo = email.split('@')[0];
  const primeiro = prefixo.split(/[._\-+\d]+/).find(parte => parte !== '') ?? prefixo;
  return primeiro.charAt(0).toUpperCase() + primeiro.slice(1);
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  usuario = signal<Usuario | null>(null);

  constructor() {
    afterNextRender(() => {
      const salvo = this.ler<Usuario | null>("usuario", null);
      this.usuario.set(salvo ? { email: salvo.email, nome: nomeDoEmail(salvo.email) } : null);
    });
  }

  entrar(email: string) {
    const digitado = email.trim().toLowerCase();
    const usuario: Usuario = { nome: nomeDoEmail(digitado), email: digitado };
    this.usuario.set(usuario);
    localStorage.setItem("usuario", JSON.stringify(usuario));
  }

  sair() {
    this.usuario.set(null);
    localStorage.removeItem("usuario");
  }

  private ler<T>(chave: string, padrao: T): T {
    try {
      const json = localStorage.getItem(chave);
      return json != null ? JSON.parse(json) : padrao;
    } catch {
      return padrao;
    }
  }
}
