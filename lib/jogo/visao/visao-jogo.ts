import { Evento } from "../evento/evento";
import { ComandoAtualizarVisao } from "../comando/comando-atualizar-visao";

import { Observable } from 'rxjs/Observable';

export interface VisaoJogo{
    entradaUsuarioStream:Observable<Evento>,
    comandosAtualizarVisaoStream:Observable<ComandoAtualizarVisao>
}