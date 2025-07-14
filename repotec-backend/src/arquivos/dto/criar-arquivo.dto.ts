import { IsString, IsNumber } from 'class-validator';

export class CriarArquivoDto {
  @IsString()
  nome: string;

  @IsString()
  caminho: string;

  @IsNumber()
  tamanho: number;

  @IsNumber()
  projetoId: number;
} 