import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  Get,
  Res,
  StreamableFile,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ArquivosService } from './arquivos.service';
import { GetUser } from '../auth/get-user.decorator';
import { Usuario } from '../usuarios/usuario.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { Response, Request } from 'express';
import { StorageService } from './storage.service';
import { AdminGuard } from '../auth/admin.guard';
import * as path from 'path';

@Controller('arquivos')
@ApiTags('Arquivos')
export class ArquivosController {
  constructor(
    private arquivosService: ArquivosService,
    private storageService: StorageService,
  ) {}

  @Post('upload/:projetoId')
  @UseGuards(AuthGuard(), AdminGuard)
  @ApiOperation({ summary: 'Upload de múltiplos arquivos' })
  @ApiResponse({ status: 201, description: 'Arquivos enviados com sucesso' })
  @ApiTags('Arquivos')
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadArquivos(
    @Param('projetoId', ParseIntPipe) projetoId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @GetUser() usuario: Usuario,
  ) {
    console.log('Files recebidos:', files?.length);
    console.log('ProjetoId:', projetoId);
    return this.arquivosService.uploadArquivos(files, projetoId, usuario);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), AdminGuard)
  @ApiOperation({ summary: 'Excluir arquivo' })
  @ApiResponse({ status: 200, description: 'Arquivo excluído com sucesso' })
  @ApiTags('Arquivos')
  @ApiParam({ name: 'id', required: true })
  @ApiBearerAuth('JWT-auth')
  async excluirArquivo(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() usuario: Usuario,
  ) {
    return this.arquivosService.excluirArquivo(id, usuario);
  }

  @Get(':id/download')
  @UseGuards(AuthGuard())
  @ApiTags('Arquivos')
  @ApiOperation({ summary: 'Download de arquivo' })
  @ApiBearerAuth('JWT-auth')
  async downloadArquivo(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() usuario: Usuario,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    try {
      console.log('Download de arquivo com ID:', id);
      const arquivo = await this.arquivosService.obterArquivo(id, usuario);
      console.log('Arquivo encontrado:', arquivo);

      const filePath = await this.storageService.obterArquivoFisico(
        arquivo.caminho,
      );
      console.log('Caminho do arquivo:', filePath);
      const stream = createReadStream(filePath);

      // Determina o tipo MIME usando o serviço
      const contentType = this.storageService.getContentTypeByExtension(
        arquivo.nome,
      );

      res.set({
        'Content-Disposition': `attachment; filename="${arquivo.nome}"`,
        'Content-Type': contentType,
      });

      return new StreamableFile(stream);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      throw error;
    }
  }

  @Get('download/:caminho')
  @UseGuards(AuthGuard())
  @ApiTags('Arquivos')
  @ApiOperation({ summary: 'Download de arquivo por caminho' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'caminho', required: true, description: 'Caminho do arquivo' })
  async obterArquivoPorCaminho(
    @Param('caminho') caminho: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    console.log('Caminho do arquivo:', caminho);

    const caminhoCompleto = await this.storageService.obterArquivoFisico(caminho);
    const nomeArquivo = path.basename(caminho);
    
    // Determina o tipo MIME usando o serviço
    const contentType = this.storageService.getContentTypeByExtension(nomeArquivo);

    // Define o Content-Disposition para forçar o download
    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${nomeArquivo}"`,
    });

    const file = createReadStream(caminhoCompleto);
    return new StreamableFile(file);
  }

  @Get('perfil/:usuarioId/:filename')
  @ApiTags('Arquivos')
  @ApiOperation({ summary: 'Obter imagem de perfil do usuário' })
  @ApiParam({ name: 'usuarioId', required: true, description: 'ID do usuário' })
  @ApiParam({ name: 'filename', required: true, description: 'Nome do arquivo' })
  async obterImagemPerfil(
    @Param('usuarioId') usuarioId: string,
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    console.log('Obtendo imagem de perfil para usuário:', usuarioId);
    console.log('Nome do arquivo:', filename);

    const caminho = `perfil/${usuarioId}/${filename}`;
    console.log('Caminho completo:', caminho);

    try {
      const caminhoCompleto = await this.storageService.obterArquivoFisico(caminho);
      console.log('Caminho físico:', caminhoCompleto);
      
      // Determina o tipo MIME usando o serviço
      const contentType = this.storageService.getContentTypeByExtension(filename);

      // Define o Content-Type para exibir a imagem no navegador
      res.set({
        'Content-Type': contentType,
      });

      const file = createReadStream(caminhoCompleto);
      return new StreamableFile(file);
    } catch (error) {
      console.error('Erro ao obter imagem de perfil:', error);
      throw error;
    }
  }
}
