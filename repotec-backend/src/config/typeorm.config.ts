import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';
import { Usuario } from '../usuarios/usuario.entity';
import { Projeto } from '../projetos/projeto.entity';
import { Arquivo } from '../arquivos/arquivo.entity';
import { Avaliacao } from '../avaliacoes/avaliacao.entity';
import { Favorito } from '../favoritos/favorito.entity';
import { Tag } from '../tags/tag.entity';
import { PerguntaFrequente } from '../perguntas-frequentes/pergunta-frequente.entity';
import { PasswordResetToken } from '../auth/entities/password-reset-token.entity';

config();

export default new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Usuario, Projeto, Arquivo, Avaliacao, Favorito, Tag, PerguntaFrequente, PasswordResetToken],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
