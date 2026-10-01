export class OpcaoProduto {
    nome: string = "";
    cor: string = "";
    estoque: number = 0;
}

export class GrupoOpcoes {
    titulo: string = "";
    opcoes: OpcaoProduto[] = [];
}
