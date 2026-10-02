import { Produto } from "./produto";
import { OpcaoProduto } from "./opcao-produto";
export class ItemCesta {
    produto: Produto = new Produto();
    opcao: string = "";
    cor: string = "";
    estoque: number = 0;
    quantidade: number = 1;
    valorUnitario: number = 0;
    valorTotal: number = 0;

    constructor(p:Produto, opcao?: OpcaoProduto){
        this.produto = p;
        if(opcao){
            this.opcao = opcao.nome;
            this.cor = opcao.cor;
            this.estoque = opcao.estoque;
        }else{
            this.estoque = p.estoque;
        }
        if(p.valorPromo>0){
            this.valorUnitario = p.valorPromo;
        }else{
            this.valorUnitario = p.valor;
        }
        this.valorTotal = this.valorUnitario*this.quantidade
    }
}
