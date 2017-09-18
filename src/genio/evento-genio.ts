
import { EventoEstendido } from "../../lib/jogo/evento/evento";
import { BotaoGenio } from "./botao-genio";

export class EventoGenio extends EventoEstendido {
    constructor(public dados:any){
        super(dados);
    }
}

export class EventoBotaoGenio extends EventoGenio {
    constructor(public botao:BotaoGenio){
        super(botao);
    }
}