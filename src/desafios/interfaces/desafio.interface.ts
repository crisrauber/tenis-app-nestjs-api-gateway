import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
export interface Desafio {
  categoria: string;
  dataHoraDesafio: Date;
  status: string;
  dataHoraSolicitacao: Date;
  dataHoraResposta: Date;
  solicitante: Jogador;
  jogadores: Array<Jogador>;
  partida?: string;
}
