import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './usuario.entity';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { ListarUsuariosQueryDto } from './dto/listar-usuarios-query.dto';
import { TipoUsuario } from './usuario.entity';
import { ArquivosService } from '../arquivos/arquivos.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private arquivosService: ArquivosService,
  ) {}

  async criarUsuario(criarUsuarioDto: CriarUsuarioDto): Promise<Usuario> {
    const { nome, email, senha } = criarUsuarioDto;

    // Verifica se já existe usuário com este email
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (usuarioExistente) {
      throw new ConflictException('Email já cadastrado');
    }

    // Cria hash da senha
    const salt = await bcrypt.genSalt();
    const hashSenha = await bcrypt.hash(senha, salt);

    const usuario = this.usuarioRepository.create({
      nome,
      email,
      senha: hashSenha,
    });

    await this.usuarioRepository.save(usuario);
    return usuario;
  }

  async listarUsuarios(query: ListarUsuariosQueryDto) {
    const { tipo, nome, pagina = 1, limite = 20 } = query;
    
    const queryBuilder = this.usuarioRepository.createQueryBuilder('usuario');

    if (tipo) {
      queryBuilder.andWhere('usuario.tipo = :tipo', { tipo });
    }

    if (nome) {
      queryBuilder.andWhere('LOWER(usuario.nome) LIKE LOWER(:nome)', { 
        nome: `%${nome}%` 
      });
    }

    const [usuarios, total] = await queryBuilder
      .select(['usuario.id', 'usuario.nome', 'usuario.email', 'usuario.tipo', 'usuario.dataCriacao'])
      .skip((pagina - 1) * limite)
      .take(limite)
      .getManyAndCount();

    return {
      dados: usuarios,
      meta: {
        total,
        pagina,
        ultimaPagina: Math.ceil(total / limite),
        limite
      }
    };
  }

  async obterUsuario(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      select: ['id', 'nome', 'email', 'tipo', 'dataCriacao', 'imagemPerfil'],
      where: { id },
      relations: ['imagemPerfil'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  async atualizarUsuario(
    id: number,
    atualizarUsuarioDto: AtualizarUsuarioDto,
  ): Promise<Usuario> {
    let usuario = await this.usuarioRepository.findOne({
      where: { id },
      select: ['id', 'nome', 'email', 'tipo', 'dataCriacao', 'imagemPerfil'],
      relations: ['imagemPerfil'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const { nome, email, senha } = atualizarUsuarioDto;

    if (email && email !== usuario.email) {
      const emailExistente = await this.usuarioRepository.findOne({
        where: { email },
      });
      if (emailExistente) {
        throw new ConflictException('Email já está em uso');
      }
      usuario.email = email;
    }

    if (nome) {
      usuario.nome = nome;
    }

    if (senha) {
      const salt = await bcrypt.genSalt();
      usuario.senha = await bcrypt.hash(senha, salt);
    }

    await this.usuarioRepository.save(usuario);
    return this.obterUsuario(usuario.id);
  }

  async excluirUsuario(id: number): Promise<void> {
    // Verifica se o usuário existe antes de tentar excluir
    const usuario = await this.usuarioRepository.findOne({
      where: { id }
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verifica se está tentando excluir um admin
    if (usuario.tipo === TipoUsuario.ADMIN) {
      throw new UnauthorizedException('Não é permitido excluir usuários administradores');
    }

    // Exclui o usuário (os arquivos serão excluídos automaticamente pelo ON DELETE CASCADE)
    const resultado = await this.usuarioRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  async alterarSenha(
    id: number,
    senhaAtual: string,
    novaSenha: string,
  ): Promise<void> {
    // Busca o usuário com a senha (não selecionada por padrão)
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verifica se a senha atual está correta
    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    // Cria hash da nova senha
    const salt = await bcrypt.genSalt();
    usuario.senha = await bcrypt.hash(novaSenha, salt);

    // Salva o usuário com a nova senha
    await this.usuarioRepository.save(usuario);
  }

  async uploadImagemPerfil(usuarioId: number, file: Express.Multer.File): Promise<Usuario> {
    const usuario = await this.obterUsuario(usuarioId);
    
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Se já existe uma imagem de perfil, exclui a antiga
    if (usuario.imagemPerfil) {
      try{
        await this.arquivosService.excluirArquivo(usuario.imagemPerfil.id, usuario);
      } catch (error) {
        console.error('Erro ao excluir imagem de perfil antiga:', error);
      }
    }

    // Upload da nova imagem
    const arquivo = await this.arquivosService.uploadArquivo(
      file,
      usuarioId,
      usuario,
      'perfil', // Pasta específica para imagens de perfil
    );

    // Atualiza a referência da imagem de perfil
    usuario.imagemPerfil = arquivo;
    return this.usuarioRepository.save(usuario);
  }
} 