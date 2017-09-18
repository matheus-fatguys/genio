import { Genio } from './genio';
import { VisaoGenio } from './visao-genio';
import { ModeloJogo } from './../../lib/jogo/modelo-jogo';
import { ConfiguracaoImpl } from './../../lib/jogo/configuracao/configuracao-impl';
import { Configuracao } from './../../lib/jogo/configuracao/configuracao';
import { ComandoAtualizarVisao } from './../../lib/jogo/comando/comando-atualizar-visao';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

export class FabricaGenioHTML5{
    public static fabricar():Genio{
        let dificuldade:number=-1;
        let strDificuldade:string=(<HTMLInputElement>document.getElementById("dificuldade")).value;
        try {
            dificuldade=parseInt(strDificuldade);        
        } catch (error) {         
            console.error(error);
        }        
        
        let configuracao:Configuracao= new ConfiguracaoImpl(dificuldade);
        let modelo:ModeloJogo={configuracao:configuracao, 
            estado:null, 
            placar:{pontos:0, resultado:null}, 
            tempoJogado:0};
        
        let produtorComandosAtualizarVisao:Observer<ComandoAtualizarVisao>;
        let comandosAtualizarVisaoStream:Observable<ComandoAtualizarVisao>=Observable.create((observer:Observer<ComandoAtualizarVisao>)=>produtorComandosAtualizarVisao=observer);

        let visao:VisaoGenio= new VisaoGenio( comandosAtualizarVisaoStream
                                            , <HTMLInputElement>document.getElementById("placar")
                                            , <HTMLInputElement>document.getElementById("tempo")
                                            , <HTMLInputElement>document.getElementById("estado")
                                            , <HTMLInputElement>document.getElementById("resultado")
                                            , <HTMLInputElement>document.getElementById("dificuldade")
                                            , <HTMLDivElement>document.getElementById("painelInfo")
                                            , <HTMLDivElement>document.getElementById("painelResultado")
                                            , <HTMLButtonElement>document.getElementById("botaoIniciar")
                                            , <HTMLButtonElement>document.getElementById("botaoPausar")
                                            , <HTMLButtonElement>document.getElementById("botaoContinuar")
                                            , <HTMLButtonElement>document.getElementById("botaoEncerrar")
                                            , <HTMLButtonElement>document.getElementById("botao0")
                                            , <HTMLButtonElement>document.getElementById("botao1")
                                            , <HTMLButtonElement>document.getElementById("botao2")
                                            , <HTMLButtonElement>document.getElementById("botao3")
                                            , <HTMLButtonElement>document.getElementById("botao4")
                                            , <HTMLButtonElement>document.getElementById("botao5")
                                            , <HTMLButtonElement>document.getElementById("botao6")
                                            , <HTMLButtonElement>document.getElementById("botao7")
                                            , <HTMLButtonElement>document.getElementById("botao8")
                                            , <HTMLButtonElement>document.getElementById("botao9")
                                            , <HTMLButtonElement>document.getElementById("botao_asterisco")
                                            , <HTMLButtonElement>document.getElementById("botao_lasanha")
                                        );
        
        return Genio.novoJogo(modelo, visao.entradaUsuarioStream, produtorComandosAtualizarVisao);
    }
}