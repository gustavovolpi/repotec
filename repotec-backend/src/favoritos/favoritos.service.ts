import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorito } from './favorito.entity';
import { Projeto } from '../projetos/projeto.entity';
import { Usuario } from '../usuarios/usuario.entity';

@Injectable()
export class FavoritosService {
  constructor(
    @InjectRepository(Favorito)
    private favoritoRepository: Repository<Favorito>,
    @InjectRepository(Projeto)
    private projetoRepository: Repository<Projeto>,
  ) {}

  async adicionarFavorito(
    projetoId: number,
    usuario: Usuario,
  ): Promise<Favorito> {
    // Verifica se o projeto existe
    const projeto = await this.projetoRepository.findOne({
      where: { id: projetoId },
    });

    if (!projeto) {
      throw new NotFoundException('Projeto não encontrado');
    }

    // Verifica se já é um favorito
    const favoritoExistente = await this.favoritoRepository.findOne({
      where: {
        projeto: { id: projetoId },
        usuario: { id: usuario.id },
      },
    });

    if (favoritoExistente) {
      throw new ConflictException('Projeto já está nos favoritos');
    }

    const favorito = this.favoritoRepository.create({
      projeto,
      usuario,
    });

    await this.favoritoRepository.save(favorito);
    return favorito;
  }

  async listarFavoritos(usuario: Usuario): Promise<Favorito[]> {
    return this.favoritoRepository.find({
      where: { usuario: { id: usuario.id } },
      relations: ['projeto', 'projeto.autor', 'projeto.tags'],
    });
  }

  async removerFavorito(projetoId: number, usuario: Usuario): Promise<void> {
    const favorito = await this.favoritoRepository.findOne({
      where: { 
        projeto: { id: projetoId },
        usuario: { id: usuario.id }
      },
      relations: ['usuario'],
    });

    if (!favorito) {
      throw new NotFoundException('Favorito não encontrado');
    }

    if (favorito.usuario.id !== usuario.id) {
      throw new UnauthorizedException(
        'Você não tem permissão para remover este favorito',
      );
    }

    await this.favoritoRepository.remove(favorito);
  }
} 