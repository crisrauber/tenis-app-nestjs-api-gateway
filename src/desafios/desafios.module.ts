import { Module } from '@nestjs/common';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { DesafiosController } from './desafios.controller';

@Module({
  controllers: [DesafiosController],
  imports: [ProxyrmqModule],
})
export class CategoriasModule {}
