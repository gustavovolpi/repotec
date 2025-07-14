import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AtualizarUsuarioDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
    required: false, // Indica que o campo é opcional
  })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'joao.silva@example.com',
    required: false, // Indica que o campo é opcional
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'novaSenha123',
    required: false, // Indica que o campo é opcional
  })
  @IsOptional()
  @IsString()
  senha?: string;
}
