import { Controller, Post, Body, ValidationPipe, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistroDto } from './dto/registro.dto';
import { TesteEmailDto } from './dto/teste-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { Usuario } from '../usuarios/usuario.entity';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/registro')
  @ApiOperation({ summary: 'Realizar registro' })
  @ApiResponse({
    status: 201,
    description: 'Registro realizado com sucesso',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5c...',
        usuario: {
          id: 3,
          nome: 'Diego B',
          email: 'diegob@example.com',
          tipo: 'aluno',
          data_criacao: '2025-03-05T02:13:08.152Z',
        },
      },
    },
  })
  registro(@Body(ValidationPipe) registroDto: RegistroDto) {
    return this.authService.registro(registroDto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Realizar login' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6I...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('/verificar-token')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Verificar validade do token' })
  @ApiResponse({
    status: 200,
    description: 'Token válido',
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  verificarToken(@GetUser() usuario: Usuario) {
    return { valido: true, usuario };
  }

  @Post('/renovar-token')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Renovar token de acesso' })
  @ApiResponse({
    status: 200,
    description: 'Token renovado com sucesso',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6I...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  renovarToken(@GetUser() usuario: Usuario) {
    return this.authService.renovarToken(usuario);
  }

  @Post('/testar-email')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Testar envio de email' })
  @ApiResponse({
    status: 200,
    description: 'Teste de email realizado com sucesso',
    schema: {
      example: {
        sucesso: true,
        mensagem: 'Email de teste enviado com sucesso para usuario@example.com',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  testarEmail(@Body(ValidationPipe) testeEmailDto: TesteEmailDto) {
    return this.authService.testarEmail(testeEmailDto.email);
  }

  @Post('/recuperar-senha')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar recuperação de senha' })
  @ApiResponse({
    status: 200,
    description: 'Email de recuperação enviado com sucesso',
    schema: {
      example: {
        message: 'Se o email estiver cadastrado, você receberá as instruções para recuperação de senha.',
      },
    },
  })
  recuperarSenha(@Body(ValidationPipe) forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.recuperarSenha(forgotPasswordDto);
  }

  @Post('/redefinir-senha')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Redefinir senha usando token de recuperação' })
  @ApiResponse({
    status: 200,
    description: 'Senha redefinida com sucesso',
    schema: {
      example: {
        message: 'Senha redefinida com sucesso.',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Token inválido, expirado ou já usado' })
  redefinirSenha(@Body(ValidationPipe) resetPasswordDto: ResetPasswordDto) {
    return this.authService.redefinirSenha(resetPasswordDto);
  }

  @Post('/validar-token-recuperacao')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validar token de recuperação de senha' })
  @ApiResponse({
    status: 200,
    description: 'Token válido',
    schema: {
      example: {
        valido: true,
        message: 'Token válido.',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Token inválido, expirado ou já usado' })
  validarTokenRecuperacao(@Body('token') token: string) {
    return this.authService.validarTokenRecuperacao(token);
  }
}
