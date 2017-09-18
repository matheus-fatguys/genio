import { ComandoAtualizarVisao, TipoComandoAtualizar, ComandoMostrarOpcao, ComandoMostrarInformacao, Informacao, ComandoAtualizarVisaoEstendido } from './../../lib/jogo//comando/comando-atualizar-visao';
import { Opcao } from './../../lib/jogo/opcao';
import { ModeloJogo } from './../../lib/jogo/modelo-jogo';
import { VisaoJogo } from './../../lib/jogo/visao/visao-jogo';
import { Evento, EventoUsuario, EventoEstendido, EventoOpcao, EventoDificuldade } from "./../../lib/jogo/evento/evento";
import { EventoGenio, EventoBotaoGenio } from "./evento-genio";
import { EstadoJogo } from "./../../lib/jogo/estado/estado-jogo";
import { ResultadosPossiveis } from "./../../lib/jogo/estado/resultado";
import { ComandoMostrarBotaoGenio } from "./comando-atualizar-visao-genio";
import { BotaoGenio } from "./botao-genio";
import { VisaoAbstrataJogo } from "./../../lib/jogo/visao/visao-abstrata-jogo";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/mapTo';


export class VisaoGenio extends VisaoAbstrataJogo {

    public entradaUsuarioStream:Observable<Evento>;

    constructor( public comandosAtualizarVisaoStream:Observable<ComandoAtualizarVisao>                
                , public placar:HTMLInputElement
                , public tempo:HTMLInputElement
                ,public estado:HTMLInputElement
                ,public resultado:HTMLInputElement
                ,public dificuldade:HTMLInputElement
                ,public painelInfo:HTMLDivElement
                ,public painelResultado:HTMLDivElement
                ,public botaoIniciar:HTMLButtonElement
                ,public botaoPausar:HTMLButtonElement
                ,public botaoContinuar:HTMLButtonElement
                ,public botaoEncerrar:HTMLButtonElement
                ,public botao0:HTMLButtonElement
                ,public botao1:HTMLButtonElement
                ,public botao2:HTMLButtonElement
                ,public botao3:HTMLButtonElement
                ,public botao4:HTMLButtonElement
                ,public botao5:HTMLButtonElement
                ,public botao6:HTMLButtonElement
                ,public botao7:HTMLButtonElement
                ,public botao8:HTMLButtonElement
                ,public botao9:HTMLButtonElement
                ,public botaoAsterisco:HTMLButtonElement
                ,public botaoLasanha:HTMLButtonElement
            ){
                super(comandosAtualizarVisaoStream);
                this.entradaUsuarioStream=super.criarStream();                      
    }

    protected criarStreamEntradaUsuario(): Observable<Evento> {
        return Observable.merge(
            Observable.fromEvent(this.dificuldade, "change").map((e)=>new EventoDificuldade(this.dificuldade.value)),
            Observable.fromEvent(this.botaoIniciar, "click").mapTo(new EventoOpcao(Opcao.INICIAR)),
            Observable.fromEvent(this.botaoPausar, "click").mapTo(new EventoOpcao(Opcao.PAUSAR)),
            Observable.fromEvent(this.botaoContinuar, "click").mapTo(new EventoOpcao(Opcao.CONTINUAR)),
            Observable.fromEvent(this.botaoEncerrar, "click").mapTo(new EventoOpcao(Opcao.ENCERRAR))            
        );
    }

    protected criarStreamEntradaUsuarioEstendida(): Observable<EventoEstendido> {
        return Observable.merge(
            Observable.fromEvent(this.botao0, "click").mapTo(new EventoBotaoGenio(BotaoGenio.BOTAO_0)),
            Observable.fromEvent(this.botao1, "click").mapTo(new EventoBotaoGenio(BotaoGenio.BOTAO_1)),
            Observable.fromEvent(this.botao2, "click").mapTo(new EventoBotaoGenio(BotaoGenio.BOTAO_2)),
            Observable.fromEvent(this.botao3, "click").mapTo(new EventoBotaoGenio(BotaoGenio.BOTAO_3)),
            Observable.fromEvent(this.botao4, "click").mapTo(new EventoBotaoGenio(BotaoGenio.BOTAO_4)),
            Observable.fromEvent(this.botao5, "click").mapTo(new EventoBotaoGenio(BotaoGenio.BOTAO_5)),
            Observable.fromEvent(this.botao6, "click").mapTo(new EventoBotaoGenio(BotaoGenio.BOTAO_6)),
            Observable.fromEvent(this.botao7, "click").mapTo(new EventoBotaoGenio(BotaoGenio.BOTAO_7)),
            Observable.fromEvent(this.botao8, "click").mapTo(new EventoBotaoGenio(BotaoGenio.BOTAO_8)),
            Observable.fromEvent(this.botao9, "click").mapTo(new EventoBotaoGenio(BotaoGenio.BOTAO_9)),
            Observable.fromEvent(this.botaoAsterisco, "click").mapTo(new EventoBotaoGenio(BotaoGenio.BOTAO_ASTERISCO)),
            Observable.fromEvent(this.botaoLasanha, "click").mapTo(new EventoBotaoGenio(BotaoGenio.BOTAO_LASANHA)),
        );
    }

    protected processarMostrarBotaoIniciar(mostrar: boolean): void {
        this.mostrarBotaoIniciar(mostrar);
    }

    protected processarMostrarBotaoPausar(mostrar: boolean): void {
        this.mostrarBotaoPausar(mostrar);
    }

    protected processarMostrarBotaoContinuar(mostrar: boolean): void {
        this.mostrarBotaoContinuar(mostrar);
    }

    protected processarMostrarBotaoEncerrar(mostrar: boolean): void {
        this.mostrarBotaoEncerrar(mostrar);
    }

    protected processarMostrarPainelInfo(mostrar: boolean): void {
        this.mostrarPainelInfo(mostrar);
    }

    protected processarMostrarPainelResultado(mostrar: boolean): void {
        this.mostrarPainelResultado(mostrar);
    }

    protected  processarComandoEstendido(comando:ComandoAtualizarVisaoEstendido){
        let comandoBotao=(<ComandoMostrarBotaoGenio>comando);
        this.processarAcenderNumero(comandoBotao.botao, comandoBotao.errado);
    }

    protected  processarAtualizarModelo (modelo: ModeloJogo){
        this.placar.value=modelo.placar.pontos.toLocaleString();
        this.tempo.value=modelo.tempoJogado.toLocaleString();
        this.estado.value=EstadoJogo[modelo.estado];
        this.resultado.value=ResultadosPossiveis[modelo.placar.resultado];
    }

    private processarAcenderNumero(botao:BotaoGenio, errado:boolean=false){
        this.botao0.classList.remove("aceso");
        this.botao1.classList.remove("aceso");
        this.botao2.classList.remove("aceso");
        this.botao3.classList.remove("aceso");
        this.botao4.classList.remove("aceso");
        this.botao5.classList.remove("aceso");
        this.botao6.classList.remove("aceso");
        this.botao7.classList.remove("aceso");
        this.botao8.classList.remove("aceso");
        this.botao9.classList.remove("aceso");
        this.botaoAsterisco.classList.remove("aceso");
        this.botaoLasanha.classList.remove("aceso");
        this.botao0.classList.remove("errado");
        this.botao1.classList.remove("errado");
        this.botao2.classList.remove("errado");
        this.botao3.classList.remove("errado");
        this.botao4.classList.remove("errado");
        this.botao5.classList.remove("errado");
        this.botao6.classList.remove("errado");
        this.botao7.classList.remove("errado");
        this.botao8.classList.remove("errado");
        this.botao9.classList.remove("errado");
        this.botaoAsterisco.classList.remove("errado");
        this.botaoLasanha.classList.remove("errado");
        let classe= errado?"errado":"aceso";
        switch(botao){
            case BotaoGenio.BOTAO_0:
                this.botao0.classList.add(classe);
                break;
            case BotaoGenio.BOTAO_1:
                this.botao1.classList.add(classe);
                break;
            case BotaoGenio.BOTAO_2:
                this.botao2.classList.add(classe);
                break;
            case BotaoGenio.BOTAO_3:
                this.botao3.classList.add(classe);
                break;
            case BotaoGenio.BOTAO_4:
                this.botao4.classList.add(classe);
                break;
            case BotaoGenio.BOTAO_5:
                this.botao5.classList.add(classe);
                break;
            case BotaoGenio.BOTAO_6:
                this.botao6.classList.add(classe);
                break;
            case BotaoGenio.BOTAO_7:
                this.botao7.classList.add(classe);
                break;
            case BotaoGenio.BOTAO_8:
                this.botao8.classList.add(classe);
                break;
            case BotaoGenio.BOTAO_9:
                this.botao9.classList.add(classe);
                break;
            case BotaoGenio.BOTAO_ASTERISCO:
                this.botaoAsterisco.classList.add(classe);
                break;
            case BotaoGenio.BOTAO_LASANHA:
                this.botaoLasanha.classList.add(classe);
                break;
        }
    }

    private mostrarBotaoIniciar(mostrar:boolean){
        if(!mostrar){
            this.botaoIniciar.classList.add("escondido");
        }
        else{
            this.botaoIniciar.classList.remove("escondido");
        }
    }
    private mostrarBotaoPausar(mostrar:boolean){
        if(!mostrar){
            this.botaoPausar.classList.add("escondido");
        }
        else{
            this.botaoPausar.classList.remove("escondido");
        }
    }
    private mostrarBotaoContinuar(mostrar:boolean){
        if(!mostrar){
            this.botaoContinuar.classList.add("escondido");
        }
        else{
            this.botaoContinuar.classList.remove("escondido");
        }
    }
    private mostrarBotaoEncerrar(mostrar:boolean){
        if(!mostrar){
            this.botaoEncerrar.classList.add("escondido");
        }
        else{
            this.botaoEncerrar.classList.remove("escondido");
        }
    }
    private mostrarPainelInfo(mostrar:boolean){
        if(!mostrar){
            this.painelInfo.classList.add("escondido");
        }
        else{
            this.painelInfo.classList.remove("escondido");
        }
    }
    private mostrarPainelResultado(mostrar:boolean){
        if(!mostrar){
            this.painelResultado.classList.add("escondido");
        }
        else{
            this.painelResultado.classList.remove("escondido");
        }
    }
}