import { IsEmail, IsString, MinLength, IsEnum, Matches, IsOptional } from 'class-validator';
import { TipoUsuario } from '../../usuarios/usuario.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RegistroDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'joao.silva@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo de 6 caracteres, deve conter letra e caractere especial. )',
    example: 'Senha@123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres. ' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'A senha deve conter pelo menos uma letra e um caractere especial. ',
  })
  senha: string;

  @ApiProperty({
    description: 'Tipo de usuário',
    enum: TipoUsuario,
    example: TipoUsuario.ALUNO,
    required: false,
  })
  @IsEnum(TipoUsuario)
  @IsOptional()
  tipo?: TipoUsuario;
}
