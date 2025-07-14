import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projeto } from './projeto.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { Tag } from '../tags/tag.entity';
import { CriarProjetoDto } from './dto/criar-projeto.dto';
import { AtualizarProjetoDto } from './dto/atualizar-projeto.dto';
import { TipoUsuario } from '../usuarios/usuario.entity';
import { ListarSemestresResponseDto } from './dto/listar-semestres.dto';
import { BuscarProjetosQueryDto } from './dto/buscar-projetos-query.dto';
import { ListagemPaginada } from '../common/interfaces/listagem-paginada.interface';

@Injectable()
export class ProjetosService {
  constructor(
    @InjectRepository(Projeto)
    private projetoRepository: Repository<Projeto>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async criarProjeto(criarProjetoDto: CriarProjetoDto, usuario: Usuario): Promise<Projeto> {
    console.log('** service.criarProjeto = ', criarProjetoDto);
    const {
      titulo,
      descricao,
      tags,
      semestre,
      professorOrientador,
      tipoProjeto,
      autorArquivos,
    } = criarProjetoDto;

    console.log('** criando projeto **');
    const projeto = this.projetoRepository.create({
      titulo,
      descricao,
      autor: usuario,
      semestre,
      professorOrientador,
      tipoProjeto,
      autorArquivos,
    });
    console.log('** projeto criado **');
    console.log('** validando tags **');
    if (tags) {
      const tagEntities = await Promise.all(
        tags.map(async (tagNome) => {
          let tag = await this.tagRepository.findOne({
            where: { nome: tagNome },
          });
          if (!tag) {
            tag = this.tagRepository.create({ nome: tagNome });
            await this.tagRepository.save(tag);
          }
          return tag;
        }),
      );
      projeto.tags = tagEntities;
    }
    console.log('** tags ok **');
    console.log('** salvando projeto **');
    await this.projetoRepository.save(projeto);
    console.log('** projeto salvo **', projeto);
    return projeto;
  }

  async buscarProjetos(
    query: BuscarProjetosQueryDto,
  ): Promise<ListagemPaginada<Projeto>> {
    const {
      termo,
      tags,
      tipoProjeto,
      autorId,
      pagina = 1,
      limite = 20,
    } = query;

    const queryBuilder = this.projetoRepository
      .createQueryBuilder('projeto')
      .leftJoinAndSelect(
        'projeto.autor',
        'autor',
        'autor.id = projeto.autor_id',
      )
      .leftJoinAndSelect('projeto.tags', 'tags')
      .leftJoinAndSelect('projeto.arquivos', 'arquivos')
      .select([
        'projeto.id',
        'projeto.titulo',
        'projeto.descricao',
        'projeto.reputacao',
        'projeto.tipoProjeto',
        'projeto.dataAtualizacao',
        'autor.id',
        'autor.nome',
        'tags',
        'arquivos',
      ])
      .orderBy('projeto.dataAtualizacao', 'DESC');

    if (termo) {
      queryBuilder.andWhere('LOWER(projeto.titulo) LIKE LOWER(:termo)', {
        termo: `%${termo}%`,
      });
    }

    if (tags) {
      const tagArray = tags.split(',').map((tag) => tag.trim());
      queryBuilder.andWhere('tags.nome IN (:...tags)', { tags: tagArray });
    }

    if (tipoProjeto) {
      queryBuilder.andWhere('projeto.tipoProjeto = :tipoProjeto', {
        tipoProjeto,
      });
    }

    if (autorId) {
      queryBuilder.andWhere('projeto.autor_id = :autorId', { autorId });
    }

    const [dados, total] = await queryBuilder
      .skip((pagina - 1) * limite)
      .take(limite)
      .getManyAndCount();

    return {
      dados,
      meta: {
        total,
        pagina,
        ultimaPagina: Math.ceil(total / limite),
        limite,
      },
    };
  }

  async obterProjeto(id: number): Promise<Projeto> {
    const projeto = await this.projetoRepository
      .createQueryBuilder('projeto')
      .leftJoinAndSelect(
        'projeto.autor',
        'autor',
        'autor.id = projeto.autor_id',
      )
      .leftJoinAndSelect('projeto.tags', 'tags')
      .leftJoinAndSelect('projeto.avaliacoes', 'avaliacoes')
      .leftJoinAndSelect('avaliacoes.usuario', 'avaliacaoUsuario')
      .leftJoinAndSelect('projeto.arquivos', 'arquivos')
      .select([
        'projeto',
        'autor.id',
        'autor.nome',
        'tags',
        'avaliacoes',
        'avaliacaoUsuario',
        'arquivos',
      ])
      .where('projeto.id = :id', { id })
      .getOne();

    if (!projeto) {
      throw new NotFoundException('Projeto não encontrado');
    }

    // Mapeia avaliações para incluir o usuário como autor
    projeto.avaliacoes = projeto.avaliacoes?.map((avaliacao) => ({
      ...avaliacao,
      autor: avaliacao.usuario,
    }));

    return projeto;
  }

  async atualizarProjeto(
    id: number,
    atualizarProjetoDto: AtualizarProjetoDto,
    usuario: Usuario,
  ): Promise<Projeto> {
    const projeto = await this.obterProjeto(id);

    if (
      projeto.autor.id !== usuario.id &&
      usuario.tipo !== TipoUsuario.ADMIN
    ) {
      throw new UnauthorizedException(
        'Você não tem permissão para atualizar este projeto',
      );
    }

    const { titulo, descricao, tags, semestre, professorOrientador, tipoProjeto, autorArquivos } =
      atualizarProjetoDto;

    if (professorOrientador) {
      projeto.professorOrientador = professorOrientador;
    }

    if (semestre) {
      projeto.semestre = semestre;
    }

    if (titulo) {
      projeto.titulo = titulo;
    }

    if (descricao) {
      projeto.descricao = descricao;
    }

    if (tipoProjeto) {
      projeto.tipoProjeto = tipoProjeto;
    }

    if (autorArquivos) {
      projeto.autorArquivos = autorArquivos;
    }

    if (tags) {
      const tagEntities = await Promise.all(
        tags.map(async (tagNome) => {
          let tag = await this.tagRepository.findOne({
            where: { nome: tagNome },
          });
          if (!tag) {
            tag = this.tagRepository.create({ nome: tagNome });
            await this.tagRepository.save(tag);
          }
          return tag;
        }),
      );
      projeto.tags = tagEntities;
    }

    return this.projetoRepository.save(projeto);
  }

  async excluirProjeto(id: number, usuario: Usuario): Promise<void> {
    const projeto = await this.obterProjeto(id);

    if (projeto.autor.id !== usuario.id && usuario.tipo !== TipoUsuario.ADMIN) {
      throw new UnauthorizedException(
        'Você não tem permissão para excluir este projeto',
      );
    }

    await this.projetoRepository.remove(projeto);
  }

  async listarSemestres(
    pagina: number = 1,
    limite: number = 10,
  ): Promise<ListarSemestresResponseDto> {
    const queryBuilder = this.projetoRepository
      .createQueryBuilder('projeto')
      .select('DISTINCT projeto.semestre', 'semestre')
      .orderBy('projeto.semestre', 'DESC');

    const total = await queryBuilder.getCount();

    const semestres = await queryBuilder
      .skip((pagina - 1) * limite)
      .take(limite)
      .getRawMany();

    return {
      dados: semestres.map((item: { semestre: string }) => item.semestre),
      meta: {
        total,
        pagina,
        ultimaPagina: Math.ceil(total / limite),
        limite,
      },
    };
  }
}
