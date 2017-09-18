import { Subject } from 'rxjs/Subject';
import { ComandoAtualizarVisao } from '../comando/comando-atualizar-visao';
import { Evento, EventoOpcao, EventoDificuldade } from '../evento/evento';
import { Observable } from 'rxjs/Observable';
import { Observer } from "rxjs/Observer";
import { ResultadosPossiveis } from '../estado/resultado';
export interface ControladorJogo {
    entradaUsuarioStream:Observable<Evento>,
    entradaUsuarioEstendidaStream:Observable<Evento>,
    produtorComandosAtualizarVisao:Observer<ComandoAtualizarVisao>,
    jogoIniciado:Observable<EventoOpcao>,
    jogoEncerrado:Observable<EventoOpcao>,
    jogoPausado:Observable<EventoOpcao>,
    jogoContinuado:Observable<EventoOpcao>,
    dificuladeAlteradaStream:Observable<EventoDificuldade>,
    fimDeJogo:Subject<ResultadosPossiveis>;
}