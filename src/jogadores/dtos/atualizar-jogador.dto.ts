import { IsOptional } from 'class-validator';

export class AtualizarJogadorDto {
  // @IsNotEmpty()
  // readonly celular: string;

  // @IsNotEmpty()
  // readonly nome: string;

  @IsOptional()
  categoria?: string;

  @IsOptional()
  urlFoto?: string;
}
