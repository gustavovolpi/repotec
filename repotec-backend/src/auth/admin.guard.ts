import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TipoUsuario } from '../usuarios/usuario.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const usuario = request.user;

    if (usuario?.tipo !== TipoUsuario.ADMIN) {
      throw new UnauthorizedException('Apenas administradores podem realizar esta ação');
    }

    return true;
  }
} 