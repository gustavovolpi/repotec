import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Arquivo } from './arquivo.entity';
import { Projeto } from '../projetos/projeto.entity';
import { TipoUsuario, Usuario } from '../usuarios/usuario.entity';
import { StorageService } from './storage.service';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArquivosService {
  private readonly dangerousExtensions = [
    '.exe',
    '.dll',
    '.so',
    '.dylib',
    '.msi',
    '.bat',
    '.cmd',
    '.sh',
    '.ps1',
    '.vbs',
    'ps1xml',
  ];

  constructor(
    @InjectRepository(Arquivo)
    private arquivoRepository: Repository<Arquivo>,
    @InjectRepository(Projeto)
    private projetoRepository: Repository<Projeto>,
    private storageService: StorageService,
    private readonly configService: ConfigService,
  ) { }

  async uploadArquivo(
    arquivo: Express.Multer.File,
    projetoId: number,
    usuario: Usuario,
    pasta: string = 'projetos',
  ): Promise<Arquivo> {
    console.log('Upload de arquivo com ID:', projetoId);
    
    const fileExtension = path.extname(arquivo.originalname).toLowerCase();

    if (this.dangerousExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        `Arquivos com extensão ${fileExtension} não são permitidos por questões de segurança.`,
      );
    }

    const ignoreUploads = this.configService.get<boolean>('IGNORE_UPLOADS');
    if (ignoreUploads && fileExtension === '.ts') {
      throw new BadRequestException(
        'Arquivos TypeScript não são permitidos quando IGNORE_UPLOADS está ativado.',
      );
    }

    // Se for upload de imagem de perfil, não precisa verificar projeto
    if (pasta === 'perfil') {
      const caminho = await this.storageService.salvarArquivo(
        arquivo,
        `${pasta}/${usuario.id}`,
      );

      const novoArquivo = this.arquivoRepository.create({
        nome: arquivo.originalname,
        caminho: caminho,
        tamanho: arquivo.size,
        contentType: arquivo.mimetype,
        usuario,
        url: `/api/arquivos/${caminho}`,
      });

      return this.arquivoRepository.save(novoArquivo);
    }

    // Para outros tipos de arquivo, verifica o projeto
    const projeto = await this.projetoRepository.findOne({
      where: { id: projetoId },
      relations: ['autor', 'arquivos'],
    });

    if (!projeto) {
      throw new NotFoundException('Projeto não encontrado');
    }

    if (projeto.autor.id !== usuario.id && usuario.tipo !== TipoUsuario.ADMIN) {
      console.log('Usuario:', usuario);
      console.log('autor:', projeto.autor.id);
      throw new UnauthorizedException(
        'Você não tem permissão para adicionar arquivos a este projeto',
      );
    }

    const caminho = await this.storageService.salvarArquivo(
      arquivo,
      `${pasta}/${projetoId}`,
    );

    const novoArquivo = this.arquivoRepository.create({
      nome: arquivo.originalname,
      caminho: caminho,
      tamanho: arquivo.size,
      contentType: arquivo.mimetype,
      usuario,
      url: `/api/arquivos/${caminho}`,
    });

    await this.arquivoRepository.save(novoArquivo);

    // Adiciona o arquivo ao projeto
    projeto.arquivos = [...(projeto.arquivos || []), novoArquivo];
    await this.projetoRepository.save(projeto);

    return novoArquivo;
  }

  async excluirArquivo(id: number, usuario: Usuario): Promise<void> {
    const arquivo = await this.arquivoRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!arquivo) {
      return; // Se o arquivo não existir, simplesmente retorna sem erro
    }

    if (arquivo.usuario.id === usuario.id) {
      try {
        await this.storageService.excluirArquivo(arquivo.caminho);
        await this.arquivoRepository.remove(arquivo);
      } catch (error) {
        // Se houver erro ao excluir o arquivo físico, ainda remove do banco
        await this.arquivoRepository.remove(arquivo);
      }
    }
  }

  async uploadArquivos(
    files: Express.Multer.File[],
    projetoId: number,
    usuario: Usuario,
  ): Promise<Arquivo[]> {
    try {
      console.log('Files recebidos:', files?.length);
      console.log('ProjetoId:', projetoId);

      const projeto = await this.projetoRepository.findOne({
        where: { id: projetoId },
        relations: ['autor', 'arquivos'],
      });

      if (!projeto) {
        throw new NotFoundException('Projeto não encontrado');
      }

      if (projeto.autor.id !== usuario.id && usuario.tipo !== TipoUsuario.ADMIN) {
        throw new UnauthorizedException(
          'Você não tem permissão para fazer upload de arquivos neste projeto',
        );
      }

      const arquivosSalvos: Arquivo[] = [];

      // Carrega os arquivos existentes do projeto
      const arquivosExistentes = projeto.arquivos || [];

      for (const file of files) {
        try {
          const arquivo = await this.uploadArquivo(file, projetoId, usuario);
          arquivosSalvos.push(arquivo);
        } catch (error) {
          // Se for um erro de validação, propaga o erro original
          if (error instanceof BadRequestException) {
            throw error;
          }
          // Para outros erros, lança um erro genérico
          throw new InternalServerErrorException(
            'Erro ao fazer upload dos arquivos',
          );
        }
      }

      // Atualiza a lista de arquivos do projeto mantendo os existentes
      projeto.arquivos = [...arquivosExistentes, ...arquivosSalvos];
      await this.projetoRepository.save(projeto);

      return arquivosSalvos;
    } catch (error) {
      // Se for um erro de validação, propaga o erro original
      if (error instanceof BadRequestException || 
          error instanceof NotFoundException || 
          error instanceof UnauthorizedException) {
        throw error;
      }
      // Para outros erros, lança um erro genérico
      throw new InternalServerErrorException(
        'Erro ao fazer upload dos arquivos',
      );
    }
  }

  async obterArquivo(id: number, usuario: Usuario): Promise<Arquivo> {
    console.log('Buscando arquivo com ID:', id);
    const arquivo = await this.arquivoRepository.findOne({
      where: { id },
      relations: ['projetos', 'projetos.autor'],
    });

    console.log('Arquivo encontrado:', arquivo);
    if (!arquivo) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    // Verifica se o arquivo existe no disco
    await this.storageService.obterArquivoFisico(arquivo.caminho);
    return arquivo;
  }
}
