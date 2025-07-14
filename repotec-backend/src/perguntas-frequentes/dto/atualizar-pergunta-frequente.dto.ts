import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AtualizarPerguntaFrequenteDto {
  @ApiProperty({
    description: 'Pergunta a ser exibida',
    example: 'Como faço para criar um projeto?',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  pergunta?: string;

  @ApiProperty({
    description: 'Resposta da pergunta',
    example: 'Para criar um projeto, acesse o menu "Projetos" e clique em "Novo Projeto".',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  resposta?: string;
} 