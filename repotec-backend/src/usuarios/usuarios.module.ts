import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './usuario.entity';
import { DominioEmail } from './dominio-email.entity';
import { DominiosEmailService } from './dominios-email.service';
import { DominiosEmailController } from './dominios-email.controller';
import { ArquivosModule } from '../arquivos/arquivos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, DominioEmail]),
    ArquivosModule,
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [UsuariosController, DominiosEmailController],
  providers: [UsuariosService, DominiosEmailService],
  exports: [UsuariosService, DominiosEmailService]
})
export class UsuariosModule {} 