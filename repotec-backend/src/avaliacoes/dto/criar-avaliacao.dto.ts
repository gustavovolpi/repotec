import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CriarAvaliacaoDto {
  @ApiProperty({
    description: 'Nota da avaliação (de 1 a 5)',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  nota: number;

  @ApiProperty({
    description: 'Comentário opcional sobre a avaliação',
    example: 'Ótimo serviço!',
    required: false,
  })
  @IsString()
  @IsOptional()
  comentario?: string;
}
