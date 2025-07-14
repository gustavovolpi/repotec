import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FavoritosService } from './favoritos.service';
import { GetUser } from '../auth/get-user.decorator';
import { Usuario } from '../usuarios/usuario.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Favoritos')
@Controller('favoritos')
@UseGuards(AuthGuard())
export class FavoritosController {
  constructor(private favoritosService: FavoritosService) {}

  @Post(':projetoId')
  @ApiOperation({ summary: 'Adicionar um projeto aos favoritos' })
  @ApiResponse({
    status: 201,
    description: 'Projeto adicionado aos favoritos com sucesso',
  })
  adicionarFavorito(
    @Param('projetoId', ParseIntPipe) projetoId: number,
    @GetUser() usuario: Usuario,
  ) {
    return this.favoritosService.adicionarFavorito(projetoId, usuario);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os favoritos do usuário' })
  @ApiResponse({ status: 200, description: 'Favoritos listados com sucesso' })
  listarFavoritos(@GetUser() usuario: Usuario) {
    return this.favoritosService.listarFavoritos(usuario);
  }

  @Delete(':projetoId')
  @ApiOperation({ summary: 'Remover um projeto dos favoritos' })
  @ApiResponse({
    status: 200,
    description: 'Projeto removido dos favoritos com sucesso',
  })
  removerFavorito(
    @Param('projetoId', ParseIntPipe) projetoId: number,
    @GetUser() usuario: Usuario,
  ) {
    return this.favoritosService.removerFavorito(projetoId, usuario);
  }
} 