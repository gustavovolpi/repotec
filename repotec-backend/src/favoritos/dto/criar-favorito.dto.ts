import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CriarFavoritoDto {
  @ApiProperty({
    description: 'ID do projeto a ser favoritado',
    example: 1,
    type: Number,
  })
  @IsNumber()
  projetoId: number;
}
