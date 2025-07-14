import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DominioEmailDto {
  @ApiProperty({
    example: 'example.com',
    description: 'Domínio de email a ser adicionado',
  })
  @IsString()
  @Matches(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, {
    message: 'Domínio inválido',
  })
  dominio: string;
} 