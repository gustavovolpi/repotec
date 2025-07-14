import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { CriarTagDto } from './dto/criar-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async criarTag(criarTagDto: CriarTagDto): Promise<Tag> {
    const { nome } = criarTagDto;

    // Verifica se já existe uma tag com este nome
    const tagExistente = await this.tagRepository.findOne({
      where: { nome },
    });

    if (tagExistente) {
      throw new ConflictException('Tag já existe');
    }

    const tag = this.tagRepository.create({ nome });
    await this.tagRepository.save(tag);
    return tag;
  }

  async obterTodasTags(): Promise<Tag[]> {
    return this.tagRepository.find({
      relations: ['projetos'],
    });
  }

  async obterTagPorId(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['projetos'],
    });

    if (!tag) {
      throw new NotFoundException('Tag não encontrada');
    }

    return tag;
  }

  async obterTagPorNome(nome: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { nome },
      relations: ['projetos'],
    });

    if (!tag) {
      throw new NotFoundException('Tag não encontrada');
    }

    return tag;
  }

  async atualizarTag(id: number, nome: string): Promise<Tag> {
    const tag = await this.obterTagPorId(id);

    // Verifica se já existe outra tag com este nome
    const tagExistente = await this.tagRepository.findOne({
      where: { nome },
    });

    if (tagExistente && tagExistente.id !== id) {
      throw new ConflictException('Já existe uma tag com este nome');
    }

    tag.nome = nome;
    await this.tagRepository.save(tag);
    return tag;
  }

  async excluirTag(id: number): Promise<void> {
    const resultado = await this.tagRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException('Tag não encontrada');
    }
  }

  async buscarTags(termo?: string): Promise<string[]> {
    const query = this.tagRepository.createQueryBuilder('tag');

    if (termo) {
      query.where('LOWER(tag.nome) LIKE LOWER(:termo)', { 
        termo: `%${termo}%` 
      });
    }

    const tags = await query
      .orderBy('tag.nome', 'ASC')
      .getMany();

    return tags.map(tag => tag.nome);
  }
} 