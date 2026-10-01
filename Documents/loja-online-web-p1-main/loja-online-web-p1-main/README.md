# Universo das Cores — Frontend (P1)

<p align="center">
  <img src="public/logo-completo.jpg" alt="Universo das Cores - Materiais de Arte" width="320">
</p>

Frontend da loja virtual **Universo das Cores** (materiais de arte), feito em **Angular**,
seguindo os mockups passados em aula
(Vitrine, Busca, Detalhe, Cesta, Login/Cadastro e Esqueci minha senha).
O P2 será construído em cima deste projeto.

**Integrantes:**
Cassiel Okada Nunes
Matheus Emanuel Souza

## Tecnologias

- Angular 22 (componentes standalone, roteamento, formulários template-driven)
- Bootstrap 5.3 (instalado via npm) para o layout responsivo
- TypeScript
- Vitest para os testes unitários

## Como rodar

Precisa do [Node.js](https://nodejs.org/) instalado.

```bash
npm install     # baixa as dependências (só na primeira vez)
npm start       # abre em http://localhost:4200
```

Outros comandos:

```bash
npm test        # roda os testes unitários
npm run build   # gera a versão de produção em dist/
npm run serve:ssr:trabalho-web-p1   # depois do build: abre a versão de produção em http://localhost:4000
```

Os comandos precisam ser rodados dentro da pasta do projeto (a que tem o `package.json`).

## Validação dos formulários

Login, Cadastro e "Esqueci minha senha" usam validação do Angular. Os erros só aparecem
depois de clicar no botão, e apenas nos campos com problema.

- **E-mail:** precisa estar no formato `nome@dominio.com`
- **Senha (login):** mínimo de 8 caracteres
- **Senha (cadastro):** 8+ caracteres com maiúscula, minúscula, número e caractere especial (`@$!%*?&`), e a confirmação precisa ser igual
- **CPF** (`000.000.000-00`) e **telefone** (`(11) 99999-9999`): a máscara é aplicada enquanto digita

## Produtos e fotos

A loja vende materiais de arte (tintas, pincéis, telas, papéis, lápis e cadernos de desenho).

- Os produtos ficam em `src/app/model/produto.service.ts`, com os campos de `Produto`:
  `codigo`, `nome`, `descritivo`, `valor`, `valorPromo`, `estoque` e `destaque`.
- A foto de cada produto é o arquivo `public/<codigo>.jpg` (por exemplo, `public/1.jpg`).
  Enquanto o arquivo não existe, aparece a imagem padrão `public/sem-foto.svg`.
- Logo: `public/logo-completo.jpg` (original) e `public/logo-icone.png` (só o ícone, com fundo
  transparente, usado no cabeçalho e na aba do navegador).
- As imagens dos produtos são ilustrativas e usadas apenas neste trabalho acadêmico.

### Opções do produto (cores)

Uma tinta existe em várias cores, mas aparece **uma vez só** na vitrine, com uma foto só.
O cliente escolhe a cor na página de detalhe, depois de clicar em **Comprar**:

- As opções ficam no mesmo arquivo (`produto.service.ts`), ligadas ao produto pelo `codigo`:
  nome da opção, cor da bolinha (hexadecimal) e estoque **de cada cor**.
- O `estoque` do produto é a soma do estoque das cores (calculado pelo serviço).
- Cores diferentes do mesmo produto ficam em linhas separadas na cesta.
- A busca também encontra pela cor: "tinta azul" acha as tintas que têm azul.
- Hoje só as **tintas** têm cores para escolher (acrílica, guache, óleo e tinta para tecido).
  Os outros produtos são comprados direto. Para dar opções a outro produto, basta incluí-lo
  na lista de opções do serviço; serve também para outras variações, como `titulo: 'Tamanho'`.
