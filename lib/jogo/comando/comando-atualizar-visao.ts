import { Opcao } from '../opcao'

export enum TipoComandoAtualizar{
    ATUALIZAR_MODELO,
    MOSTRAR_OPCAO,
    MOSTRAR_INFORMCACAO,
    ESTENDIDO
}

export enum Informacao{
    ESTADO,
    RESULTADO
}

export class ComandoAtualizarVisao{
    constructor(public tipo:TipoComandoAtualizar, public dados?:any){
    }
}

export class ComandoMostrarOpcao extends ComandoAtualizarVisao{
    constructor(public opcao:Opcao, public mostrar:boolean){
        super(TipoComandoAtualizar.MOSTRAR_OPCAO, opcao);
    }
}

export class ComandoMostrarInformacao extends ComandoAtualizarVisao{
    constructor(public informacao:Informacao, public mostrar:boolean){
        super(TipoComandoAtualizar.MOSTRAR_INFORMCACAO, informacao);
    }
}

export class ComandoAtualizarVisaoEstendido extends ComandoAtualizarVisao{
    constructor(public dados?:any){
        super(TipoComandoAtualizar.ESTENDIDO, dados)
    }
}

export class ComandoAtualizarModelo extends ComandoAtualizarVisao{
    constructor(public modelo:any){
        super(TipoComandoAtualizar.ATUALIZAR_MODELO, modelo);
    }
}