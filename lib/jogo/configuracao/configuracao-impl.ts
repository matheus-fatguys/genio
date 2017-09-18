import { Configuracao } from './configuracao';

export const dificuldadeMinima=1;

export class ConfiguracaoImpl implements Configuracao{
    constructor(public dificuldade:number){

    }
    public isValida():boolean{
        return this.dificuldade>=dificuldadeMinima;
    }
}