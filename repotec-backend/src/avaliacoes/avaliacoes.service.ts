import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avaliacao } from './avaliacao.entity';
import { Projeto } from '../projetos/projeto.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { CriarAvaliacaoDto } from './dto/criar-avaliacao.dto';

@Injectable()
export class AvaliacoesService {
  constructor(
    @InjectRepository(Avaliacao)
    private avaliacaoRepository: Repository<Avaliacao>,
    @InjectRepository(Projeto)
    private projetoRepository: Repository<Projeto>,
  ) {}

  async criarAvaliacao(
    projetoId: number,
    criarAvaliacaoDto: CriarAvaliacaoDto,
    usuario: Usuario,
  ): Promise<Avaliacao> {
    console.log('Criando avaliação:', projetoId);
    const projeto = await this.projetoRepository.findOne({
      where: { id: projetoId },
      relations: ['autor', 'avaliacoes'],
    });

    if (!projeto) {
      throw new NotFoundException('Projeto não encontrado');
    }

    // Verifica se o usuário já avaliou este projeto
    const avaliacaoExistente = await this.avaliacaoRepository.findOne({
      where: {
        projeto: { id: projetoId },
        usuario: { id: usuario.id },
      },
    });

    if (avaliacaoExistente) {
      console.log('Avaliação existente encontrada:', avaliacaoExistente);
      throw new ConflictException('Você já avaliou este projeto');
    }

    const avaliacao = this.avaliacaoRepository.create({
      ...criarAvaliacaoDto,
      projeto,
      usuario,
    });

    await this.avaliacaoRepository.save(avaliacao);

    // Atualiza a reputação do projeto
    const avaliacoes = projeto.avaliacoes || [];
    avaliacoes.push(avaliacao);
    projeto.reputacao =
      avaliacoes.reduce((sum, av) => sum + av.nota, 0) / avaliacoes.length;

    await this.projetoRepository.save(projeto);

    return avaliacao;
  }

  async atualizarAvaliacao(
    id: number,
    criarAvaliacaoDto: CriarAvaliacaoDto,
    usuario: Usuario,
  ): Promise<Avaliacao> {
    const avaliacao = await this.avaliacaoRepository.findOne({
      where: { id },
      relations: ['usuario', 'projeto', 'projeto.avaliacoes'],
    });

    if (!avaliacao) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    if (avaliacao.usuario.id !== usuario.id) {
      throw new UnauthorizedException(
        'Você não tem permissão para atualizar esta avaliação',
      );
    }

    avaliacao.nota = criarAvaliacaoDto.nota;
    avaliacao.comentario = criarAvaliacaoDto.comentario || null;

    await this.avaliacaoRepository.save(avaliacao);

    // Atualiza a reputação do projeto
    const projeto = avaliacao.projeto;
    projeto.reputacao =
      projeto.avaliacoes.reduce((sum, av) => sum + av.nota, 0) /
      projeto.avaliacoes.length;

    await this.projetoRepository.save(projeto);

    return avaliacao;
  }

  async excluirAvaliacao(id: number, usuario: Usuario): Promise<void> {
    const avaliacao = await this.avaliacaoRepository.findOne({
      where: { id },
      relations: ['projeto', 'projeto.avaliacoes'],
    });

    if (!avaliacao) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    const projeto = avaliacao.projeto;
    await this.avaliacaoRepository.remove(avaliacao);

    // Atualiza a reputação do projeto
    const avaliacoesRestantes = projeto.avaliacoes.filter(av => av.id !== id);
    projeto.reputacao = avaliacoesRestantes.length
      ? avaliacoesRestantes.reduce((sum, av) => sum + av.nota, 0) / avaliacoesRestantes.length
      : 0;

    await this.projetoRepository.save(projeto);
  }

  async buscarAvaliacaoPorProjetoEUsuario(
    projetoId: number,
    usuarioId: number,
  ): Promise<Avaliacao | null> {
    return await this.avaliacaoRepository.findOne({
      where: {
        projeto: { id: projetoId },
        usuario: { id: usuarioId },
      },
      relations: ['usuario', 'projeto'],
    });
  }
}
