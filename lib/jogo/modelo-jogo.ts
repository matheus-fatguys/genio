import { Placar } from './estado/placar';
import { Configuracao } from "./configuracao/configuracao";
import { EstadoJogo } from "./estado/estado-jogo";

export interface ModeloJogo {
    configuracao:Configuracao,
    placar: Placar,
    estado:EstadoJogo,
    tempoJogado:number
}