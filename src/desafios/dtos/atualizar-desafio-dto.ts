import { IsNotEmpty } from 'class-validator';

export class AtualizarDesafioDto {
  @IsNotEmpty()
  readonly status: string;
}
