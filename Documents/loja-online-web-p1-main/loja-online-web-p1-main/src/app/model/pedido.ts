import { ItemCesta } from "./item-cesta";

export class Pedido {
    numero: number = 0;
    data: string = "";
    email: string = "";
    itens: ItemCesta[] = [];
    total: number = 0;
}
