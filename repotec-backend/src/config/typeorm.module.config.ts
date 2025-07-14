import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Usuario } from '../usuarios/usuario.entity';
import { Projeto } from '../projetos/projeto.entity';
import { Arquivo } from '../arquivos/arquivo.entity';
import { Avaliacao } from '../avaliacoes/avaliacao.entity';
import { Favorito } from '../favoritos/favorito.entity';
import { Tag } from '../tags/tag.entity';
import { PerguntaFrequente } from '../perguntas-frequentes/pergunta-frequente.entity';
import { DominioEmail } from '../usuarios/dominio-email.entity';
import { PasswordResetToken } from '../auth/entities/password-reset-token.entity';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get('DATABASE_HOST'),
  port: configService.get('DATABASE_PORT'),
  username: configService.get('DATABASE_USER'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  entities: [Usuario, Projeto, Arquivo, Avaliacao, Favorito, Tag, PerguntaFrequente, DominioEmail, PasswordResetToken],
  synchronize: false, //configService.get('NODE_ENV') !== 'production',
});
