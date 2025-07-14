import { Injectable, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class StorageService {
  private readonly uploadDir = join(process.cwd(), 'uploads');
  private readonly sourceCodeExtensions = [
    '.js',
    '.ts',
    '.jsx',
    '.tsx',
    '.py',
    '.rb',
    '.php',
    '.java',
    '.cpp',
    '.c',
    '.h',
    '.cs',
    '.go',
    '.rs',
    '.swift',
    '.kt',
    '.scala',
    '.r',
    '.m',
    '.sh',
    '.bash',
    '.zsh',
    '.fish',
    '.sql',
    '.pl',
    '.pm',
    '.t',
    '.html',
    '.css',
    '.scss',
    '.sass',
    '.less',
    '.vue',
    '.svelte',
  ];

  constructor() {
    // Cria o diretório de uploads se não existir
    fs.mkdir(this.uploadDir, { recursive: true });
  }

  async salvarArquivo(
    arquivo: Express.Multer.File,
    pasta: string,
  ): Promise<string> {
    console.log('Salvando arquivo na pasta:', pasta);
    const pastaCompleta = join(this.uploadDir, pasta);
    await fs.mkdir(pastaCompleta, { recursive: true });

    console.log('Pasta completa:', pastaCompleta);

    const nomeUnico = `${uuid()}-${arquivo.originalname}`;
    const caminhoArquivo = join(pasta, nomeUnico);
    const caminhoCompleto = join(this.uploadDir, caminhoArquivo);

    console.log('Caminho completo:', caminhoCompleto);
    await fs.writeFile(caminhoCompleto, arquivo.buffer);
    console.log('Arquivo salvo com sucesso:', caminhoArquivo);
    return caminhoArquivo;
  }

  async excluirArquivo(caminho: string): Promise<void> {
    console.log('Excluindo arquivo:', caminho);
    const caminhoCompleto = join(this.uploadDir, caminho);
    console.log('Caminho completo:', caminhoCompleto);
    await fs.unlink(caminhoCompleto);
  }

  async obterArquivoFisico(caminhoRelativo: string): Promise<string> {
    console.log('Obtendo arquivo físico:', caminhoRelativo);
    const caminhoCompleto = join(this.uploadDir, caminhoRelativo);

    try {
      await fs.access(caminhoCompleto);
      console.log('Arquivo encontrado em:', caminhoCompleto);
      return caminhoCompleto;
    } catch {
      console.error('Erro ao acessar arquivo');
      throw new NotFoundException(
        `Arquivo físico não encontrado: ${caminhoCompleto}`,
      );
    }
  }

  isSourceCodeFile(filename: string): boolean {
    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    return this.sourceCodeExtensions.includes(ext);
  }

  getContentTypeByExtension(filename: string): string {
    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();

    // Mapeamento de extensões para tipos MIME
    const mimeTypes: Record<string, string> = {
      // Imagens
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      
      // Documentos
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      
      // Arquivos compactados
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
      '.7z': 'application/x-7z-compressed',
      '.tar': 'application/x-tar',
      '.gz': 'application/gzip',
      
      // Código-fonte
      '.js': 'application/javascript',
      '.ts': 'text/plain',
      '.jsx': 'text/plain',
      '.tsx': 'text/plain',
      '.html': 'text/html',
      '.htm': 'text/html',
      '.css': 'text/css',
      '.json': 'application/json',
      '.xml': 'application/xml',
      '.md': 'text/markdown',
      '.txt': 'text/plain',
      '.csv': 'text/csv',
      '.py': 'text/plain',
      '.rb': 'text/plain',
      '.php': 'text/plain',
      '.java': 'text/plain',
      '.cpp': 'text/plain',
      '.c': 'text/plain',
      '.cs': 'text/plain',
      '.go': 'text/plain',
      '.rs': 'text/plain',
      '.swift': 'text/plain',
      '.kt': 'text/plain',
      '.scala': 'text/plain',
      '.r': 'text/plain',
      '.m': 'text/plain',
      '.sh': 'text/plain',
      '.bash': 'text/plain',
      '.zsh': 'text/plain',
      '.fish': 'text/plain',
      '.sql': 'text/plain',
      '.pl': 'text/plain',
      '.pm': 'text/plain',
      '.t': 'text/plain',
      '.scss': 'text/plain',
      '.sass': 'text/plain',
      '.less': 'text/plain',
      '.vue': 'text/plain',
      '.svelte': 'text/plain',
      
      // Outros formatos comuns
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.mp4': 'video/mp4',
      '.avi': 'video/x-msvideo',
      '.mov': 'video/quicktime',
      '.webm': 'video/webm',
      '.ttf': 'font/ttf',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.eot': 'application/vnd.ms-fontobject',
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }
}
