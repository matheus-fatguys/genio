import { Subject } from 'rxjs/Subject';
import { EventoGenio, EventoBotaoGenio } from './evento-genio';
import { BotaoGenio } from "./botao-genio";
import { ComandoMostrarBotaoGenio } from "./comando-atualizar-visao-genio";

import { ControladorAbstratoJogo } from './../../lib/jogo/controlador/controlador-abstrato-jogo';
import { EstadoJogo } from './../../lib/jogo/estado/estado-jogo';
import { ResultadosPossiveis } from './../../lib/jogo/estado/resultado';
import { Evento, EventoEstendido } from './../../lib/jogo/evento/evento';
import { ComandoMostrarInformacao, ComandoMostrarOpcao, ComandoAtualizarVisao, Informacao, ComandoAtualizarModelo } from './../../lib/jogo/comando/comando-atualizar-visao';
import { ModeloJogo } from "../../lib/jogo/modelo-jogo";
import { Opcao } from './../../lib/jogo/opcao';

import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/skipUntil';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/scan';


export class Genio extends ControladorAbstratoJogo{

    private sequenciaGeradaStream:Observable<BotaoGenio>;
    
    private constructor(public modelo:ModeloJogo, public entradaUsuarioStream:Observable<Evento>, public produtorComandosAtualizarVisao:Observer<ComandoAtualizarVisao>){
        super(modelo, entradaUsuarioStream, produtorComandosAtualizarVisao);
    }

    private gerarNumerosAleatorios():number[]{
        let numeros:number[]=[] as number[];
        for(let i=0;i<this.modelo.configuracao.dificuldade;i++){
            let ultimoNumero =numeros[numeros.length-1];
            let numero=ultimoNumero;
            while(numero===ultimoNumero){
                numero=Math.round(Math.random()*11);
            }
            numeros[i]=numero;
        }
        return numeros;
    }

    private mostrarSequencia():Observable<BotaoGenio>{
        let sequenciaCadenciada=Observable.zip(
            this.sequenciaGeradaStream,
            Observable.timer(0, 1000),
            (botao, i)=>botao
        )
        .takeUntil(this.jogoEncerrado);
        sequenciaCadenciada.subscribe(
            botao=>{
                this.acenderNumero(botao, false)
            }
        )        
       return sequenciaCadenciada;
    }

    private iniciarDesafio(){
        let sequenciaGerada=this.gerarNumerosAleatorios();
        this.sequenciaGeradaStream=Observable.from(sequenciaGerada)
        .map((numero)=>ComandoMostrarBotaoGenio.botao(numero))
        .share();

        let sequenciaFoiExibida:Observable<BotaoGenio>= this.mostrarSequencia()
        .last()
        .delay(1000);

        let entradaLiberada=this.entradaUsuarioEstendidaStream.skipUntil(sequenciaFoiExibida);

        let usuarioErrou=new Subject();

        let fim=Observable.merge(
            this.jogoEncerrado,
            usuarioErrou,
            this.fimDeJogo
        )
        
        let parRespostaPergunta=Observable.zip(
            entradaLiberada.map(evento=>(<EventoBotaoGenio>evento).botao),
            this.sequenciaGeradaStream
        )
        .takeUntil(fim);

        let acertosStream=parRespostaPergunta.filter(par=>par[0]==par[1]);
        let errosStream=parRespostaPergunta.filter(par=>par[0]!=par[1]);
        
        sequenciaFoiExibida.subscribe(
            _=>this.acenderNumero(-1, false), error=>console.error(error)
        );
        
        let venceuObs = acertosStream
        .mapTo(1)
        .scan((acumulado, atual) =>++acumulado,0);

        acertosStream
        .subscribe(par=>this.processarUsuarioAcertou(par[0])
        , error=>console.error(error))
        
        venceuObs
        .subscribe(acertos=>{
            if(acertos>=sequenciaGerada.length)
                this.venceu()
        })
        // , ()=>this.venceu());

        errosStream.subscribe(par=>{
            let entrada=par[0];
            usuarioErrou.next(par);
            this.processarUsuarioErrou(entrada)
        });
        
    }

    protected processarJogoIniciou(): void {
        this.iniciarDesafio();        
    }

    protected processarJogoEncerrou(): void {
    }

    protected processarJogoPausou(): void {
    }

    protected processarJogoContinuou(): void {
    }

    protected processarVenceu(): void {
    }

    protected processarPerdeu(): void {
    }

    protected processarTempo(): void {
    }

    private processarUsuarioAcertou(botao:BotaoGenio){
        this.modelo.placar.pontos++;
        this.acenderNumeroComEspera(botao, false);
        this.mostrarNovoPlacar();
    }

    private processarUsuarioErrou(botao:BotaoGenio){
        this.acenderNumeroComEspera(botao, true);
        this.perdeu();
    }

    private acenderNumeroComEspera(botao:BotaoGenio, mostrar:boolean){ 
        Observable.of(this.acenderNumero(botao, mostrar))
        .delay(1000)
        .subscribe(
            _=>this.acenderNumero(-1, false)
        );
    }
    

    private acenderNumero(botao:BotaoGenio, errado:boolean){
        this.produtorComandosAtualizarVisao.next(new ComandoMostrarBotaoGenio(botao, errado)); 
    }

    public static novoJogo(modelo:ModeloJogo, entradaUsuarioStream:Observable<Evento>, produtorComandosAtualizarVisao:Observer<ComandoAtualizarVisao>):Genio{
        let jogo = new Genio( modelo, entradaUsuarioStream, produtorComandosAtualizarVisao);
        return jogo;
    }

}
