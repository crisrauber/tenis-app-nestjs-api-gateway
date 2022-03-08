import {
  BadRequestException,
  Body,
  ConsoleLogger,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { firstValueFrom, Observable } from 'rxjs';
import { AwsService } from 'src/aws/aws.service';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(
    private readonly clientPrpxySmartRanking: ClientProxySmartRanking,
    private awsService: AwsService,
  ) {}

  private clientAdminBackend =
    this.clientPrpxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() criarJogadorDto: CriarJogadorDto) {
    const categoria = await this.clientAdminBackend.send(
      'consultar-categorias',
      criarJogadorDto.categoria,
    );

    console.log(categoria);

    const teste = await firstValueFrom(categoria);

    console.log(teste);

    if (teste) {
      await this.clientAdminBackend.emit('criar-jogador', criarJogadorDto);
    } else {
      throw new BadRequestException('Categoria nao cadastrada');
    }
  }

  @Post('/:_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadArquivo(
    @UploadedFile() file: unknown,
    @Param('_id') _id: string,
  ) {
    const jogador = await this.clientAdminBackend
      .send('consultar-jogadores', _id)
      .toPromise();

    if (!jogador) {
      throw new BadRequestException('Jogador nao encontrado');
    }

    const urlFotoJogador = await this.awsService.uploadArquivo(file, _id);

    const atualizarJogadorDto: AtualizarJogadorDto = {
      urlFoto: urlFotoJogador,
    };

    console.log(atualizarJogadorDto);

    await this.clientAdminBackend.emit('atualizar-jogador', {
      id: _id,
      jogador: atualizarJogadorDto,
    });

    return await this.clientAdminBackend.send('consultar-jogadores', _id);
  }

  @Get()
  consultarJogador(@Query('idJogador') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consultar-jogadores', _id ? _id : '');
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Param('_id') _id: string,
    @Body() atualizarJogadorDto: AtualizarJogadorDto,
  ) {
    const categoria = await this.clientAdminBackend
      .send('consultar-categoria', atualizarJogadorDto.categoria)
      .toPromise();
    if (categoria) {
      this.clientAdminBackend.emit('atualizar-jogador', {
        id: _id,
        jogador: atualizarJogadorDto,
      });
    } else {
      throw new BadRequestException('Categoria nao cadastrada');
    }
  }

  @Delete('/:_id')
  @UsePipes(ValidationPipe)
  deletarJogador(@Param('_id') _id: string) {
    this.clientAdminBackend.emit('deletar-jogador', _id);
  }
}
