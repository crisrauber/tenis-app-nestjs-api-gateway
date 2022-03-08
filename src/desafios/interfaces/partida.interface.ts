import { Jogador } from 'src/jogadores/interfaces/jogador.interface';

export interface Partida {
  categoria: string;
  def: Jogador;
  desafio?: string;
  jogadores: Array<Jogador>;
  resultado: Array<Resultado>;
}

export interface Resultado {
  set: string;
}
