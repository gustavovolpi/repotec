import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AvaliacoesService } from './avaliacoes.service';
import { CriarAvaliacaoDto } from './dto/criar-avaliacao.dto';
import { GetUser } from '../auth/get-user.decorator';
import { Usuario } from '../usuarios/usuario.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';

@Controller('avaliacoes')
@UseGuards(AuthGuard())
export class AvaliacoesController {
  constructor(private avaliacoesService: AvaliacoesService) {}

  @Get('projeto/:projetoId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Buscar avaliação do usuário logado para um projeto' })
  @ApiResponse({ status: 200, description: 'Avaliação encontrada com sucesso' })
  async buscarAvaliacaoDoUsuario(
    @Param('projetoId', ParseIntPipe) projetoId: number,
    @GetUser() usuario: Usuario,
  ) {
    return await this.avaliacoesService.buscarAvaliacaoPorProjetoEUsuario(
      projetoId,
      usuario.id,
    );
  }

  @Post('projeto/:projetoId')
  async criarAvaliacao(
    @Param('projetoId', ParseIntPipe) projetoId: number,
    @Body() criarAvaliacaoDto: CriarAvaliacaoDto,
    @GetUser() usuario: Usuario,
  ) {
    console.log('Verificando/Criando avaliação para projeto:', projetoId);
    try {
      // Primeiro verifica se já existe uma avaliação deste usuário para este projeto
      const avaliacaoExistente =
        await this.avaliacoesService.buscarAvaliacaoPorProjetoEUsuario(
          projetoId,
          usuario.id,
        );

      if (avaliacaoExistente) {
        console.log('Atualizando avaliação existente:', avaliacaoExistente.id);
        return await this.avaliacoesService.atualizarAvaliacao(
          avaliacaoExistente.id,
          criarAvaliacaoDto,
          usuario,
        );
      } else {
        console.log('Criando nova avaliação');
        return await this.avaliacoesService.criarAvaliacao(
          projetoId,
          criarAvaliacaoDto,
          usuario,
        );
      }
    } catch (error) {
      console.error('Erro ao processar avaliação:', error);
      throw error;
    }
  }

  @Put(':id')
  atualizarAvaliacao(
    @Param('id', ParseIntPipe) id: number,
    @Body() criarAvaliacaoDto: CriarAvaliacaoDto,
    @GetUser() usuario: Usuario,
  ) {
    console.log('Atualizando avaliação:', id);
    return this.avaliacoesService.atualizarAvaliacao(
      id,
      criarAvaliacaoDto,
      usuario,
    );
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Excluir uma avaliação' })
  @ApiResponse({ status: 200, description: 'Avaliação excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  async excluirAvaliacao(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() usuario: Usuario,
  ) {
    return this.avaliacoesService.excluirAvaliacao(id, usuario);
  }
}
