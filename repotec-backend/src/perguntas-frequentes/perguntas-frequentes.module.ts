import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerguntasFrequentesController } from './perguntas-frequentes.controller';
import { PerguntasFrequentesService } from './perguntas-frequentes.service';
import { PerguntaFrequente } from './pergunta-frequente.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PerguntaFrequente]),
    AuthModule,
  ],
  controllers: [PerguntasFrequentesController],
  providers: [PerguntasFrequentesService],
  exports: [PerguntasFrequentesService],
})
export class PerguntasFrequentesModule {} 