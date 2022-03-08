import { Module } from '@nestjs/common';
import { AwsModule } from 'src/aws/aws.module';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { JogadoresController } from './jogadores.controller';

@Module({
  controllers: [JogadoresController],
  imports: [ProxyrmqModule, AwsModule],
})
export class JogadoresModule {}
