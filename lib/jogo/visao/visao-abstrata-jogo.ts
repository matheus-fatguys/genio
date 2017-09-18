import { ComandoAtualizarModelo } from './../comando/comando-atualizar-visao';
import { ModeloJogo } from '../modelo-jogo';
import { ComandoAtualizarVisao, TipoComandoAtualizar, ComandoAtualizarVisaoEstendido, ComandoMostrarOpcao, ComandoMostrarInformacao, Informacao } from '../comando/comando-atualizar-visao';
import { Evento, EventoUsuario, EventoEstendido } from '../evento/evento';
import { VisaoJogo } from './visao-jogo';
import { Opcao } from './../opcao';

import { Observable } from 'rxjs/Observable';

export abstract class VisaoAbstrataJogo implements VisaoJogo{
    public entradaUsuarioStream:Observable<Evento>;    

    constructor( public comandosAtualizarVisaoStream:Observable<ComandoAtualizarVisao>                
            ){            
            this.comandosAtualizarVisaoStream
            .subscribe(comando=>{
                try {
                    this.processarComandoAtualizarVisao(comando)                    
                } catch (error) {
                    console.log(error)
                }
            }, error=>console.error(error), ()=>console.log("completou"));
    }

    protected criarStream():Observable<Evento>{  
        let stream=this.criarStreamEntradaUsuario();   
        let streamEstendida=this.criarStreamEntradaUsuarioEstendida();   
        return Observable.merge(
            stream,           
            streamEstendida
        );
    }

    private processarComandoAtualizarVisao(comando:ComandoAtualizarVisao){
        switch(comando.tipo){
            case TipoComandoAtualizar.ATUALIZAR_MODELO:
                this.processarComandoAtualizarModelo(<ComandoAtualizarModelo>comando);
                break;
            case TipoComandoAtualizar.MOSTRAR_OPCAO:
                this.processarComandoMostrarOpcao(<ComandoMostrarOpcao>comando);
                break;
            case TipoComandoAtualizar.MOSTRAR_INFORMCACAO:
                this.processarComandoMostrarInformacao(<ComandoMostrarInformacao>comando);
                break;
            case TipoComandoAtualizar.ESTENDIDO:
                this.processarComandoEstendido(<ComandoAtualizarVisaoEstendido>comando);
                break;
        }
    }

    private processarComandoMostrarInformacao(comando:ComandoMostrarInformacao){
        switch(comando.informacao){
            case Informacao.ESTADO:
                this.processarMostrarPainelInfo(comando.mostrar);
                break;
            case Informacao.RESULTADO:
                this.processarMostrarPainelResultado(comando.mostrar);
                break;
        }
    }


    private processarComandoMostrarOpcao(comando:ComandoMostrarOpcao){
        switch(comando.opcao){
            case Opcao.INICIAR:
                this.processarMostrarBotaoIniciar(comando.mostrar);
                break;
            case Opcao.PAUSAR:
                this.processarMostrarBotaoPausar(comando.mostrar);
                break;
            case Opcao.CONTINUAR:
                this.processarMostrarBotaoContinuar(comando.mostrar);
                break;
            case Opcao.ENCERRAR:
                this.processarMostrarBotaoEncerrar(comando.mostrar);
                break;
        }
    }
    private processarComandoAtualizarModelo(comando:ComandoAtualizarModelo){
        this.processarAtualizarModelo(comando.modelo)
    }

    protected abstract criarStreamEntradaUsuario():Observable<EventoEstendido>;
    protected abstract criarStreamEntradaUsuarioEstendida():Observable<EventoEstendido>;
    protected abstract processarComandoEstendido(comando:ComandoAtualizarVisaoEstendido):void;    
    protected abstract processarAtualizarModelo (modelo: ModeloJogo):void;
    protected abstract processarMostrarBotaoIniciar(mostrar:boolean):void;
    protected abstract processarMostrarBotaoPausar(mostrar:boolean):void
    protected abstract processarMostrarBotaoContinuar(mostrar:boolean):void
    protected abstract processarMostrarBotaoEncerrar(mostrar:boolean):void
    protected abstract processarMostrarPainelInfo(mostrar:boolean):void
    protected abstract processarMostrarPainelResultado(mostrar:boolean):void
}