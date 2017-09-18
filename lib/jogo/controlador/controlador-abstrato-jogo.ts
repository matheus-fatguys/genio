import { ComandoAtualizarModelo } from './../comando/comando-atualizar-visao';
import { ComandoAtualizarVisao, TipoComandoAtualizar, ComandoMostrarOpcao, ComandoMostrarInformacao, Informacao } from '../comando/comando-atualizar-visao';
import { Evento, EventoUsuario, EventoEstendido, EventoOpcao, EventoDificuldade } from '../evento/evento';
import { ModeloJogo } from '../modelo-jogo';
import { ControladorJogo } from './controlador-jogo';
import { EstadoJogo } from "../estado/estado-jogo";
import { ResultadosPossiveis } from "../estado/resultado";
import { Opcao } from "../opcao";

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Observer } from "rxjs/Observer";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/never';
import 'rxjs/add/observable/interval';

export abstract class ControladorAbstratoJogo implements ControladorJogo {

    jogoIniciado:Observable<EventoOpcao>;
    jogoEncerrado:Observable<EventoOpcao>;
    jogoPausado:Observable<EventoOpcao>;
    jogoContinuado:Observable<EventoOpcao>;
    entradaUsuarioEstendidaStream:Observable<EventoEstendido>;
    dificuladeAlteradaStream:Observable<EventoDificuldade>;
    fimDeJogo= new Subject<ResultadosPossiveis>();

    constructor(public modelo: ModeloJogo
        , public entradaUsuarioStream:Observable<Evento>
        , public produtorComandosAtualizarVisao:Observer<ComandoAtualizarVisao>
    ) {        

        let eventosOpcaoStream = this.entradaUsuarioStream
        .filter(evento=>evento instanceof EventoOpcao)
        .map(evento=><EventoOpcao> evento);

        this.jogoIniciado=eventosOpcaoStream
        .filter(evento=>evento.opcao===Opcao.INICIAR);        
        
        this.jogoEncerrado=eventosOpcaoStream
        .filter(evento=>evento.opcao===Opcao.ENCERRAR);
        
        this.jogoPausado=eventosOpcaoStream
        .filter(evento=>evento.opcao===Opcao.PAUSAR);
        
        this.jogoContinuado=eventosOpcaoStream
        .filter(evento=>evento.opcao===Opcao.CONTINUAR);

        this.dificuladeAlteradaStream=entradaUsuarioStream
        .filter(evento=>evento.eventoUsuario===EventoUsuario.DIFICULDADE)
        .map(evento=><EventoDificuldade> evento);

        let timer=Observable.interval(1000);        
              
        let obsPausador= Observable.merge(
            this.jogoPausado.mapTo(true),
            this.jogoEncerrado.mapTo(true),
            this.jogoContinuado.mapTo(false),
            this.jogoIniciado.mapTo(false),
            this.fimDeJogo.mapTo(true)
        )
        .distinctUntilChanged();
        
        let timerPausavel=obsPausador
        .switchMap(pausado=>pausado?Observable.never():timer)
        .share()//necessário pra que todas as subscriptions compartilhem a mesma stream        
        timerPausavel.subscribe(s=>this.atualizarTempo());

        let entradaPausavel=obsPausador
        .switchMap(pausado=>pausado?Observable.never<Evento>():this.entradaUsuarioStream)
        .share()//necessário pra que todas as subscriptions compartilhem a mesma stream
        entradaPausavel.subscribe();//necessário pra iniciar o observable logo

        this.entradaUsuarioEstendidaStream=entradaPausavel
        .filter(evento=>evento.eventoUsuario == EventoUsuario.ESTENDIDO);
        
        this.jogoIniciado.subscribe(e=>this.iniciar());
        this.jogoEncerrado.subscribe(e=>this.encerrar());
        this.jogoPausado.subscribe(e=>this.pausar());
        this.jogoContinuado.subscribe(e=>this.continuar());        
        this.dificuladeAlteradaStream.subscribe(e=>this.atualizarDificuldade(e.dificuldade));   
        
    }
    

    private iniciar(){
        if(this.modelo.configuracao.isValida()){
              
            this.modelo.placar={pontos:0, resultado:null};
            this.modelo.tempoJogado=0;
            this.mudarEstado(EstadoJogo.CRIADO);
            this.mudarEstado(EstadoJogo.JOGANDO);
            this.mostrarEstadoDoJogo(true);
            this.mostrarBotaoIniciar(false);
            this.mostrarBotaoPausar(false);
            this.mostrarBotaoContinuar(false);
            this.mostrarBotaoEncerrar(true);
            this.mostrarResultadoDojogo(false);
            this.processarJogoIniciou();            
            this.mostrarBotaoPausar(true);
            this.mostrarBotaoContinuar(false);
        }
        else{
            this.mudarEstado(EstadoJogo.CONFIGURACAO_INVALIDA);
        }
    }

    private pausar(){
        this.mostrarBotaoIniciar(false);
        this.mostrarBotaoPausar(false);
        this.mostrarBotaoContinuar(true);
        this.mudarEstado(EstadoJogo.PAUSADO);
        this.processarJogoPausou();
    }
    
    private continuar(){
        this.mostrarBotaoIniciar(false);
        this.mostrarBotaoPausar(true);
        this.mostrarBotaoContinuar(false);
        this.mudarEstado(EstadoJogo.JOGANDO);
        this.processarJogoContinuou();
    }

    private encerrar(){    
        if(this.modelo.placar.resultado==null){
            this.modelo.placar.resultado=ResultadosPossiveis.DESISTIU;
        }
        this.mostrarEstadoDoJogo(true);
        this.mostrarBotaoIniciar(true);
        this.mostrarBotaoPausar(false);
        this.mostrarBotaoContinuar(false);
        this.mostrarBotaoEncerrar(false);
        this.mostrarResultadoDojogo(true);
        this.mudarEstado(EstadoJogo.ENCERRADO);
        this.fimDeJogo.next(this.modelo.placar.resultado);
        this.processarJogoEncerrou();
    }

    private mudarEstado(novoEstado:EstadoJogo){
        this.modelo.estado=novoEstado;
        this.notificarModeloMudou();
    }

    private notificarModeloMudou(){
        let comando=new ComandoAtualizarModelo(this.modelo);
        this.produtorComandosAtualizarVisao.next(comando);
    }

    private atualizarDificuldade(novaDificuldade:string){
        try {
            this.modelo.configuracao.dificuldade=parseInt(novaDificuldade);
        } catch (error) {
            
        }
    }

    private atualizarTempo(){
        this.modelo.tempoJogado++;
        this.produtorComandosAtualizarVisao.next(new ComandoAtualizarModelo(this.modelo));
        this.processarTempo();
    }

    protected perdeu(){
        this.modelo.placar.resultado=ResultadosPossiveis.PERDEU;
        this.processarPerdeu();
        this.encerrar();
    }
    
    protected venceu(){
        this.modelo.placar.resultado=ResultadosPossiveis.VENCEU;
        this.processarVenceu();
        this.encerrar();
    }

    protected mostrarNovoPlacar(){    
        this.produtorComandosAtualizarVisao.next(new ComandoAtualizarModelo(this.modelo));
    }

    private mostrarEstadoDoJogo(mostrar:boolean){
        this.produtorComandosAtualizarVisao.next(new ComandoMostrarInformacao(Informacao.ESTADO, mostrar)); 
    }

    private mostrarResultadoDojogo(mostrar:boolean){
        this.produtorComandosAtualizarVisao.next(new ComandoAtualizarModelo(this.modelo)); 
        this.produtorComandosAtualizarVisao.next(new ComandoMostrarInformacao(Informacao.RESULTADO, mostrar)); 
    }

    private mostrarBotaoIniciar(mostrar:boolean){
        this.produtorComandosAtualizarVisao.next(new ComandoMostrarOpcao(Opcao.INICIAR, mostrar)); 
    }

    private mostrarBotaoPausar(mostrar:boolean){
        this.produtorComandosAtualizarVisao.next(new ComandoMostrarOpcao(Opcao.PAUSAR, mostrar)); 
    }

    private mostrarBotaoContinuar(mostrar:boolean){
        this.produtorComandosAtualizarVisao.next(new ComandoMostrarOpcao(Opcao.CONTINUAR, mostrar)); 
    }

    private mostrarBotaoEncerrar(mostrar:boolean){
        this.produtorComandosAtualizarVisao.next(new ComandoMostrarOpcao(Opcao.ENCERRAR, mostrar)); 
    }

    protected abstract processarJogoIniciou(): void;
    protected abstract processarJogoEncerrou(): void;
    protected abstract processarJogoPausou(): void;
    protected abstract processarJogoContinuou(): void;
    protected abstract processarVenceu(): void;
    protected abstract processarPerdeu(): void;
    protected abstract processarTempo(): void;
}