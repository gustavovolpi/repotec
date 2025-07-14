import { IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum TipoUsuario {
  ALUNO = 'aluno',
  PROFESSOR = 'professor',
  ADMINI = 'admin',
}

export class ListarUsuariosQueryDto {
  @IsOptional()
  @IsEnum(TipoUsuario)
  @ApiPropertyOptional({ enum: TipoUsuario })
  tipo?: TipoUsuario;

  @IsOptional()
  @ApiPropertyOptional({ 
    description: 'Filtrar usuários por nome (busca parcial)',
    example: 'João' 
  })
  nome?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ default: 1 })
  pagina?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({ default: 20 })
  limite?: number = 20;
} 