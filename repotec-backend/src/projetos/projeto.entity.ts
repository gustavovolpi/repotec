import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Arquivo } from '../arquivos/arquivo.entity';
import { Tag } from '../tags/tag.entity';
import { Avaliacao } from '../avaliacoes/avaliacao.entity';

export enum TipoProjeto {
  TCC = 'TCC',
  ARTIGO = 'Artigo Científico',
  OUTROS = 'Outros',
}

@Entity('projetos')
export class Projeto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  titulo: string;

  @Column('text')
  descricao: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.projetosAutor)
  @JoinColumn({ name: 'autor_id' })
  autor: Usuario;

  @Column({ name: 'autor_id' })
  autorId: number;

  @Column({ name: 'autor_arquivos', length: 255, nullable: true })
  autorArquivos: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'data_criacao',
  })
  dataCriacao: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'data_atualizacao',
  })
  dataAtualizacao: Date;

  @Column('float', { default: 0 })
  reputacao: number;

  @Column({ length: 255, nullable: true, name: 'professor_orientador' })
  professorOrientador: string;

  @ManyToMany(() => Tag, (tag) => tag.projetos)
  @JoinTable({
    name: 'projeto_tags',
    joinColumn: { name: 'projeto_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @ManyToMany(() => Arquivo, (arquivo) => arquivo.projetos)
  @JoinTable({
    name: 'arquivos_projetos',
    joinColumn: { name: 'projeto_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'arquivo_id', referencedColumnName: 'id' },
  })
  arquivos: Arquivo[];

  @OneToMany(() => Avaliacao, (avaliacao: Avaliacao) => avaliacao.projeto, {
    eager: false,
  })
  avaliacoes: Avaliacao[];

  @Column({
    length: 7,
    nullable: true,
  })
  semestre: string;

  @Column({
    type: 'enum',
    enum: TipoProjeto,
    default: TipoProjeto.OUTROS,
    name: 'tipo_projeto',
  })
  tipoProjeto: TipoProjeto;
}