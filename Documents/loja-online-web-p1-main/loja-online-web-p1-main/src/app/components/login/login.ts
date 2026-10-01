import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../model/auth.service';
import { EsqueciSenha } from '../esqueci-senha/esqueci-senha';

@Component({
  imports: [CommonModule, FormsModule, RouterLink, EsqueciSenha],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  retorno: string | null = inject(ActivatedRoute).snapshot.queryParamMap.get('retorno');

  email: string = '';
  senha: string = '';
  tentou: boolean = false;
  esqueciAberto: boolean = false;

  entrar(f: NgForm) {
    this.tentou = true;
    if (f.invalid) return;

    this.auth.entrar(this.email);
    this.router.navigateByUrl(this.destino());
  }

  private destino(): string {
    const r = this.retorno;
    return r && r.startsWith('/') && !r.startsWith('//') ? r : '/';
  }
}
