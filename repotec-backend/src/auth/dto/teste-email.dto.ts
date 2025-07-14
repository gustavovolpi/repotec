import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TesteEmailDto {
  @ApiProperty({
    description: 'Email para onde o teste será enviado',
    example: 'usuario@example.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsString()
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;
} 