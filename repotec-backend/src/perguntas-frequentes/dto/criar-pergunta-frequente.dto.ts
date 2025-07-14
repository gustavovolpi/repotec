import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CriarPerguntaFrequenteDto {
  @ApiProperty({
    description: 'Pergunta a ser exibida',
    example: 'Como faço para criar um projeto?',
  })
  @IsString()
  @IsNotEmpty()
  pergunta: string;

  @ApiProperty({
    description: 'Resposta da pergunta',
    example: 'Para criar um projeto, acesse o menu "Projetos" e clique em "Novo Projeto".',
  })
  @IsString()
  @IsNotEmpty()
  resposta: string;
} 