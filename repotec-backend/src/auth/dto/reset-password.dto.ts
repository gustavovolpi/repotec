import { IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'NovaSenha@123',
    description: 'Nova senha do usuário (mínimo de 6 caracteres, deve conter letra e caractere especial)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'A senha deve conter pelo menos uma letra e um caractere especial',
  })
  password: string;

  @ApiProperty({
    example: 'token-de-recuperacao',
    description: 'Token de recuperação de senha',
  })
  @IsString()
  token: string;
} 