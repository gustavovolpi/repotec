import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjetosController } from './projetos.controller';
import { ProjetosService } from './projetos.service';
import { Projeto } from './projeto.entity';
import { Tag } from '../tags/tag.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Projeto, Tag, Usuario]),
    AuthModule,
  ],
  controllers: [ProjetosController],
  providers: [ProjetosService],
  exports: [ProjetosService],
})
export class ProjetosModule {} 