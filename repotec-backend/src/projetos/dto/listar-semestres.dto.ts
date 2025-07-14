import { ApiProperty } from '@nestjs/swagger';

export class ListarSemestresResponseDto {
  @ApiProperty({
    description: 'Lista de semestres disponíveis',
    example: ['2024.1', '2023.2', '2023.1']
  })
  dados: string[];

  @ApiProperty({
    description: 'Informações de paginação',
    example: {
      total: 10,
      pagina: 1,
      ultimaPagina: 2,
      limite: 5
    }
  })
  meta: {
    total: number;
    pagina: number;
    ultimaPagina: number;
    limite: number;
  };
} 