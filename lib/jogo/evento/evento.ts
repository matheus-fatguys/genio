import { Opcao } from "../opcao";

export enum EventoUsuario {
    OPCAO,
    DIFICULDADE,
    ESTENDIDO
}

export class Evento{
    constructor(public eventoUsuario:EventoUsuario, public dados?:any){
    }
}

export class EventoOpcao extends Evento{
    constructor(public opcao:Opcao){
        super(EventoUsuario.OPCAO, opcao);
    }
}

export class EventoDificuldade extends Evento{
    constructor(public dificuldade:string){
        super(EventoUsuario.DIFICULDADE, dificuldade);
    }
}

export class EventoEstendido extends Evento{
    constructor(public dados?:any){
        super(EventoUsuario.ESTENDIDO, dados);
    }
}