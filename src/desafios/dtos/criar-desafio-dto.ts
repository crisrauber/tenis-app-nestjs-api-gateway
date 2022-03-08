import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';

export class CriarDesafioDto {
  @IsNotEmpty()
  readonly solicitante: string;

  @IsNotEmpty()
  readonly categoria: string;

  @IsNotEmpty()
  @IsDateString()
  readonly dataHoraDesafio: Date;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  readonly jogadores: Array<Jogador>;
}
