import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsEnum,
  Matches,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoProjeto } from '../projeto.entity';

export class AtualizarProjetoDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Título do projeto' })
  titulo?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Descrição detalhada do projeto' })
  descricao?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({ description: 'Lista de tags do projeto', type: [String] })
  tags?: string[];

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

  @IsOptional()
  @IsEnum(TipoProjeto)
  @ApiPropertyOptional({ enum: TipoProjeto })
  tipoProjeto?: TipoProjeto;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Nome do professor orientador' })
  professorOrientador?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Nome do autor dos arquivos' })
  autorArquivos?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: 'ID do autor do projeto' })
  autorId?: number;
}
