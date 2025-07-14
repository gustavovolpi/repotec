import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArquivosController } from './arquivos.controller';
import { ArquivosService } from './arquivos.service';
import { StorageService } from './storage.service';
import { Arquivo } from './arquivo.entity';
import { Projeto } from '../projetos/projeto.entity';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Arquivo, Projeto]),
    AuthModule,
    ConfigModule,
  ],
  controllers: [ArquivosController],
  providers: [ArquivosService, StorageService],
  exports: [ArquivosService],
})
export class ArquivosModule {} 