import { IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AlterarSenhaDto {
  @ApiProperty({
    description: 'Senha atual do usuário',
    example: 'senhaAtual123',
  })
  @IsString()
  senhaAtual: string;

  @ApiProperty({
    description: 'Nova senha do usuário (mínimo de 6 caracteres, deve conter letra e caractere especial)',
    example: 'NovaSenha@123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'A senha deve conter pelo menos uma letra e um caractere especial',
  })
  novaSenha: string;
} 