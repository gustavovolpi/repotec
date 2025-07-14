import {
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsEnum,
  Matches,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TipoProjeto } from '../projeto.entity';

export class BuscarProjetosQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Termo para buscar no título do projeto',
    example: 'Sistema Web',
  })
  termo?: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  @ApiPropertyOptional({
    description: 'Filtrar por tags específicas (separadas por vírgula)',
    example: 'React,Node.js',
  })
  tags?: string;

  @IsOptional()
  @IsString()
  @Matches(/^$|^\d{4}\.[1-2]$/, {
    message: 'O semestre deve estar no formato AAAA.N (ex: 2024.1) ou vazio',
    groups: ['semestre'],
  })
  @ApiPropertyOptional({
    description: 'Filtrar por semestre (formato AAAA.N)',
    example: '2024.1',
  })
  semestre?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional({
    description: 'ID do autor',
    example: 1,
  })
  autorId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Número da página',
    default: 1,
  })
  pagina?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({
    description: 'Quantidade de itens por página',
    default: 12,
  })
  limite?: number = 12;

  @IsOptional()
  @IsEnum(TipoProjeto)
  tipoProjeto?: TipoProjeto;
}
