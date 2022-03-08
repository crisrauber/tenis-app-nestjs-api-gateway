import { Module } from '@nestjs/common';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { CategoriaController } from './categorias.controller';

@Module({
  controllers: [CategoriaController],
  imports: [ProxyrmqModule],
})
export class CategoriasModule {}
