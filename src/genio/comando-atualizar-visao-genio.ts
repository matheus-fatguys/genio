import { ComandoAtualizarVisaoEstendido } from "../../lib/jogo/comando/comando-atualizar-visao";
import { BotaoGenio } from "./botao-genio";

export enum TipoComandoAtualizarVisaoGenio {
    MOSTRAR_BOTAO
}

export class ComandoMostrarBotaoGenio extends ComandoAtualizarVisaoEstendido{
    constructor(public botao:BotaoGenio, public errado:boolean=false){
        super(botao)
    }
    static  criar(numero:number, errado:boolean=false):ComandoMostrarBotaoGenio{
        return new ComandoMostrarBotaoGenio(ComandoMostrarBotaoGenio.botao(numero), errado);
    }
    
    static botao(numero:number):BotaoGenio{
        let botao:BotaoGenio;
        switch(numero){
            case BotaoGenio.BOTAO_0:
                return BotaoGenio.BOTAO_0
            case BotaoGenio.BOTAO_1:
                return BotaoGenio.BOTAO_1
            case BotaoGenio.BOTAO_2:
                return BotaoGenio.BOTAO_2
            case BotaoGenio.BOTAO_3:
                return BotaoGenio.BOTAO_3
            case BotaoGenio.BOTAO_4:
                return BotaoGenio.BOTAO_4
            case BotaoGenio.BOTAO_5:
                return BotaoGenio.BOTAO_5
            case BotaoGenio.BOTAO_6:
                return BotaoGenio.BOTAO_6
            case BotaoGenio.BOTAO_7:
                return BotaoGenio.BOTAO_7
            case BotaoGenio.BOTAO_8:
                return BotaoGenio.BOTAO_8
            case BotaoGenio.BOTAO_9:
                return BotaoGenio.BOTAO_9
            case BotaoGenio.BOTAO_ASTERISCO:
                return BotaoGenio.BOTAO_ASTERISCO
            case BotaoGenio.BOTAO_LASANHA:
                return BotaoGenio.BOTAO_LASANHA
            default:
            return null;
        }
    }
}