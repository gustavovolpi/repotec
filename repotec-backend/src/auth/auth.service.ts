import {
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuarios/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { RegistroDto } from './dto/registro.dto';
import { DominiosEmailService } from '../usuarios/dominios-email.service';
import { MailService } from '../common/mail';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

export class UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  imagemPerfil?: {
    id: number;
    url: string;
  };
}

function getResponseUser(usuario: Usuario): UsuarioResponse {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    tipo: usuario.tipo,
    imagemPerfil: usuario.imagemPerfil
      ? {
          id: usuario.imagemPerfil.id,
          url: usuario.imagemPerfil.url,
        }
      : undefined,
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(PasswordResetToken)
    private passwordResetTokenRepository: Repository<PasswordResetToken>,
    private jwtService: JwtService,
    @Inject(forwardRef(() => DominiosEmailService))
    private dominiosEmailService: DominiosEmailService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async registro(
    registroDto: RegistroDto,
  ): Promise<{ token: string; usuario: any }> {
    console.log('Registro de usuário:', registroDto);
    const { nome, email, senha, tipo } = registroDto;

    // Verifica se já existe usuário com este email
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (usuarioExistente) {
      throw new UnauthorizedException('Email já cadastrado');
    }

    // Verifica se o domínio do email é válido
    const dominioValido =
      await this.dominiosEmailService.verificarDominioValido(email);

    if (!dominioValido) {
      // Busca os primeiros 5 domínios permitidos
      const dominiosPermitidos = await this.dominiosEmailService.listarDominios();

      const primeirosDominios = dominiosPermitidos
        .filter((d) => d.ativo)
        .slice(0, 5)
        .map((d) => d.dominio);

      throw new UnauthorizedException(
        `Domínio de email não permitido. Domínios permitidos: ${primeirosDominios.join(', ')}`,
      );
    }

    // Cria hash da senha
    const salt = await bcrypt.genSalt();
    const hashSenha = await bcrypt.hash(senha, salt);

    // Cria novo usuário
    const usuario = this.usuarioRepository.create({
      nome,
      email,
      senha: hashSenha,
      tipo,
    });

    await this.usuarioRepository.save(usuario);

    // Envia email de boas-vindas em background
    setTimeout(() => {
      this.mailService.enviarEmailBoasVindas(nome, email).catch((error) => {
        console.error('Erro ao enviar email de boas-vindas:', error);
      });
    }, 0);

    // Gera token JWT
    const token = this.jwtService.sign({ id: usuario.id });

    return {
      token,
      usuario: getResponseUser(usuario),
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ token: string; usuario: UsuarioResponse }> {
    console.log('Login de usuário:', loginDto);
    const { email, senha } = loginDto;

    // Busca usuário pelo email com a relação de imagem de perfil
    const usuario = await this.usuarioRepository.findOne({
      where: { email },
      relations: ['imagemPerfil'],
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verifica senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gera token JWT
    const token = this.jwtService.sign({ id: usuario.id });
    return { token, usuario: getResponseUser(usuario) };
  }

  renovarToken(usuario: Usuario): { token: string } {
    // Gera um novo token JWT
    const token = this.jwtService.sign({ id: usuario.id });
    return { token };
  }

  /**
   * Testa o envio de email
   * @param email Email para onde o teste será enviado
   * @returns Promise<{ sucesso: boolean; mensagem: string }> Resultado do teste
   */
  async testarEmail(
    email: string,
  ): Promise<{ sucesso: boolean; mensagem: string }> {
    try {
      const resultado = await this.mailService.enviarEmailTeste(email);

      if (resultado) {
        return {
          sucesso: true,
          mensagem: `Email de teste enviado com sucesso para ${email}`,
        };
      } else {
        return {
          sucesso: false,
          mensagem: `Falha ao enviar email de teste para ${email}`,
        };
      }
    } catch (error) {
      return {
        sucesso: false,
        mensagem: `Erro ao testar envio de email: ${error.message}`,
      };
    }
  }

  /**
   * Inicia o processo de recuperação de senha
   * @param forgotPasswordDto DTO com o email do usuário
   * @returns Promise<{ message: string }> Mensagem de confirmação
   */
  async recuperarSenha(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    console.log('Buscando usuário pelo email:', email);
    // Busca o usuário pelo email
    const usuario = await this.usuarioRepository.findOne({
      where: { email },
    });

    console.log(usuario);
    // Se o usuário não existir, não informamos para evitar enumeração de usuários
    if (!usuario) {
      console.log('Usuário não encontrado');
      return {
        message:
          'Se o email estiver cadastrado, você receberá as instruções para recuperação de senha.',
      };
    }

    console.log('Gerando token...');
    // Gera um token aleatório
    const token = crypto.randomBytes(32).toString('hex');
    console.log('Token gerado:', token);
    // Define a data de expiração (24 horas)
    const expiraEm = new Date();
    expiraEm.setHours(expiraEm.getHours() + 24);

    console.log('Criando token de recuperação...');
    // Cria o token de recuperação
    const passwordResetToken = this.passwordResetTokenRepository.create({
      token,
      usuarioId: usuario.id,
      expira_em: expiraEm,
    });

    console.log('Salvando token no banco de dados...');
    // Salva o token no banco de dados
    await this.passwordResetTokenRepository.save(passwordResetToken);

    // Gera o link de recuperação
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const resetLink = `${frontendUrl}/redefinir-senha?token=${token}`;

    // Envia o email de recuperação em background
    setTimeout(() => {
      this.mailService
        .enviarEmailRecuperacaoSenha(usuario.nome, usuario.email, resetLink)
        .catch((error) => {
          console.error('Erro ao enviar email de recuperação:', error);
        });
    }, 0);

    return {
      message:
        'Se o email estiver cadastrado, você receberá as instruções para recuperação de senha.',
    };
  }

  /**
   * Redefine a senha do usuário usando um token de recuperação
   * @param resetPasswordDto DTO com a nova senha e o token
   * @returns Promise<{ message: string }> Mensagem de confirmação
   */
  async redefinirSenha(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, password } = resetPasswordDto;

    // Busca o token de recuperação
    const passwordResetToken = await this.passwordResetTokenRepository.findOne({
      where: { token },
      relations: ['usuario'],
    });

    // Verifica se o token existe
    if (!passwordResetToken) {
      throw new BadRequestException(
        'Token de recuperação inválido ou expirado.',
      );
    }

    // Verifica se o token já foi usado
    if (passwordResetToken.usado) {
      throw new BadRequestException('Token de recuperação já foi usado.');
    }

    // Verifica se o token expirou
    if (passwordResetToken.expira_em < new Date()) {
      throw new BadRequestException('Token de recuperação expirado.');
    }

    // Cria hash da nova senha
    const salt = await bcrypt.genSalt();
    const hashSenha = await bcrypt.hash(password, salt);

    // Atualiza a senha do usuário
    const usuario = passwordResetToken.usuario;
    usuario.senha = hashSenha;
    await this.usuarioRepository.save(usuario);

    // Marca o token como usado
    passwordResetToken.usado = true;
    await this.passwordResetTokenRepository.save(passwordResetToken);

    return { message: 'Senha redefinida com sucesso.' };
  }

  async validarTokenRecuperacao(token: string) {
    try {
      const tokenRecuperacao = await this.passwordResetTokenRepository.findOne({
        where: { token },
        relations: ['usuario'],
      });

      if (!tokenRecuperacao) {
        throw new BadRequestException('Token inválido');
      }

      if (tokenRecuperacao.expira_em < new Date()) {
        throw new BadRequestException('Token expirado');
      }

      if (tokenRecuperacao.usado) {
        throw new BadRequestException('Token já utilizado');
      }

      return {
        valido: true,
        message: 'Token válido',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao validar token');
    }
  }
}
