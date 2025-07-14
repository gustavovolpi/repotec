import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/typeorm.module.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { ProjetosModule } from './projetos/projetos.module';
import { ArquivosModule } from './arquivos/arquivos.module';
import { TagsModule } from './tags/tags.module';
import { AvaliacoesModule } from './avaliacoes/avaliacoes.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { PerguntasFrequentesModule } from './perguntas-frequentes/perguntas-frequentes.module';
import { MailModule } from './common/mail';

console.log('==================');
console.log(process.version);
console.log('==================');
const crypto = require('crypto');
// Testando se o crypto está funcionando
const secretKey = crypto.randomBytes(32);
console.log(secretKey);
console.log('==================');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
    UsuariosModule,
    AuthModule,
    ProjetosModule,
    ArquivosModule,
    TagsModule,
    AvaliacoesModule,
    FavoritosModule,
    PerguntasFrequentesModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
