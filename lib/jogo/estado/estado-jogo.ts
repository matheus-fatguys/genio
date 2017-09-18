export enum EstadoJogo{
    CRIADO=0,
    JOGANDO,
    PAUSADO,
    ENCERRADO,
    CONFIGURACAO_INVALIDA
}

export namespace EstadoJogo {
    export function isInicial(estado:EstadoJogo) {
        return estado===EstadoJogo.CRIADO;
    }
    export function isFinal(estado:EstadoJogo) {
        return estado===EstadoJogo.ENCERRADO|| estado===EstadoJogo.CONFIGURACAO_INVALIDA;
    }
}