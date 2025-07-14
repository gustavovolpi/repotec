import {
  IsNotEmpty,
  IsString,
  IsArray,
  Length,
  IsOptional,
  IsEnum,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoProjeto } from '../projeto.entity';

export class CriarProjetoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Título do projeto' })
  titulo: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Descrição detalhada do projeto' })
  descricao: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ description: 'Lista de tags do projeto', type: [String] })
  tags: string[];

  @IsOptional()
  @IsString()
  @Matches(/^$|^\d{4}\.[1-2]$/, {
    message: 'O semestre deve estar no formato AAAA.N (ex: 2024.1) ou vazio',
    groups: ['semestre'],
  })
  @ApiPropertyOptional({
    description: 'Semestre do projeto no formato AAAA.N',
    example: '2024.1',
  })
  semestre?: string;

  @IsEnum(TipoProjeto)
  tipoProjeto: TipoProjeto;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Nome do professor orientador' })
  professorOrientador?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Nome do autor dos arquivos' })
  autorArquivos?: string;
}
