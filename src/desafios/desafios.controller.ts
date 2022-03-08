import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { atribuirDesafioPartida } from './dtos/atribuir-desafio-partida.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio-dto';
import { CriarDesafioDto } from './dtos/criar-desafio-dto';
import { Desafio } from './interfaces/desafio.interface';
import { DesafioStatusValidacaoPipe } from './pipes/desafio-status-pipe';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(
    private readonly clientPrpxySmartRanking: ClientProxySmartRanking,
  ) {}

  private clientAdminBackend =
    this.clientPrpxySmartRanking.getClientProxyAdminBackendInstance();

  private clientDesafios =
    this.clientPrpxySmartRanking.getClientProxyDesafiosInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(@Body() criarDesafioDto: CriarDesafioDto) {
    const jogadores: Jogador[] = await this.clientAdminBackend
      .send('consultar-jogadores', '')
      .toPromise();

    criarDesafioDto.jogadores.map(async (jogadorDto) => {
      const jogadorFilter: Jogador = jogadores.find(
        (jogador) => jogador._id == jogadorDto._id,
      );

      if (!jogadorFilter) {
        throw new BadRequestException(
          `O id ${jogadorDto._id} nao e um jogador`,
        );
      }

      if (jogadorFilter.categoria != criarDesafioDto.categoria) {
        throw new BadRequestException(
          `O jogador ${jogadorFilter._id} nao faz parte da categoria informada`,
        );
      }
    });

    const solicitanteEhJogadorDaPartida: Jogador =
      criarDesafioDto.jogadores.find(
        (jogador) => jogador._id === criarDesafioDto.solicitante,
      );

    if (!solicitanteEhJogadorDaPartida) {
      throw new BadRequestException(
        `O solicitante deve ser um jogador da partida`,
      );
    }

    const categoria = await this.clientAdminBackend
      .send('consultar-categorias', criarDesafioDto.categoria)
      .toPromise();

    if (!categoria) {
      throw new BadRequestException(`Categoria informada inexistente`);
    }

    await this.clientDesafios.emit('criar-desafio', criarDesafioDto);
  }

  @Get()
  @UsePipes(ValidationPipe)
  async consultarDesafios(@Query('idJogador') idJogador: string): Promise<any> {
    if (idJogador) {
      const jogador: Jogador = await this.clientAdminBackend
        .send('consultar-jogadores', { idJogador: idJogador })
        .toPromise();

      if (!jogador) {
        throw new BadRequestException(`Jogador nao cadastrado`);
      }
    }
    return this.clientAdminBackend
      .send('consultar-desafios', {
        idJogador: idJogador,
        _id: '',
      })
      .toPromise();
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarDesafio(
    @Param('id', ValidacaoParametrosPipe) id: string,
    @Body(DesafioStatusValidacaoPipe) atualizarDesafio: AtualizarDesafioDto,
  ): Promise<void> {
    await this.desafiosService.atualizarDesafio(id, atualizarDesafio);
  }

  @Put('/:id/partida/')
  @UsePipes(ValidationPipe)
  async atribuirPartidaDesafio(
    @Param('id', ValidacaoParametrosPipe) id: string,
    @Body() atribuirDesafioPartida: atribuirDesafioPartida,
  ): Promise<void> {
    await this.desafiosService.atribuirDesafioPartida(
      id,
      atribuirDesafioPartida,
    );
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  async cancelarDesafio(
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<void> {
    await this.desafiosService.cancelarDesafio(id);
  }
}
