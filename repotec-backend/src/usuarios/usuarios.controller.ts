import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  UnauthorizedException,
  ValidationPipe,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsuariosService } from './usuarios.service';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { GetUser } from '../auth/get-user.decorator';
import { Usuario } from './usuario.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ListarUsuariosQueryDto } from './dto/listar-usuarios-query.dto';
import { AdminGuard } from '../auth/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AlterarSenhaDto } from './dto/alterar-senha.dto';

@ApiTags('Usuários')
@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar dados do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
  })
  atualizarUsuarioAutenticado(
    @Body(ValidationPipe) atualizarUsuarioDto: AtualizarUsuarioDto,
    @GetUser() usuario: Usuario,
  ) {
    return this.usuariosService.atualizarUsuario(
      usuario.id,
      atualizarUsuarioDto,
    );
  }

  @Post('alterar-senha')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Alterar senha do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Senha alterada com sucesso',
  })
  @ApiResponse({
    status: 401,
    description: 'Senha atual incorreta',
  })
  alterarSenha(
    @Body(ValidationPipe) alterarSenhaDto: AlterarSenhaDto,
    @GetUser() usuario: Usuario,
  ) {
    return this.usuariosService.alterarSenha(
      usuario.id,
      alterarSenhaDto.senhaAtual,
      alterarSenhaDto.novaSenha,
    );
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
  })
  listarUsuarios(@Query(new ValidationPipe({ transform: true })) query: ListarUsuariosQueryDto) {
    return this.usuariosService.listarUsuarios(query);
  }

  @Get('self')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter dados do usuário atual' })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário retornados com sucesso',
  })
  obterUsuarioAtual(@GetUser() usuario: Usuario) {
    return this.usuariosService.obterUsuario(usuario.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um usuário por ID' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso' })
  obterUsuario(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.obterUsuario(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard(), AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar um usuário específico' })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
  })
  atualizarUsuario(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) atualizarUsuarioDto: AtualizarUsuarioDto,
  ) {
    return this.usuariosService.atualizarUsuario(id, atualizarUsuarioDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Excluir um usuário existente' })
  @ApiResponse({
    status: 200,
    description: 'Usuário excluído com sucesso',
  })
  excluirUsuario(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.excluirUsuario(id);
  }

  @Post('imagem-perfil')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Upload de imagem de perfil do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Imagem de perfil atualizada com sucesso',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImagemPerfil(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() usuario: Usuario,
  ) {
    return this.usuariosService.uploadImagemPerfil(usuario.id, file);
  }
}
