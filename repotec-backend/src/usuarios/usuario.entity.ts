import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { Projeto } from '../projetos/projeto.entity';
import { Avaliacao } from '../avaliacoes/avaliacao.entity';
import { Favorito } from '../favoritos/favorito.entity';
import { Arquivo } from '../arquivos/arquivo.entity';

export enum TipoUsuario {
  ALUNO = 'aluno',
  PROFESSOR = 'professor',
  ADMIN = 'admin',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nome: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  senha: string;

  @Column({
    type: 'enum',
    enum: TipoUsuario,
    default: TipoUsuario.ALUNO,
  })
  tipo: TipoUsuario;

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

  @OneToMany(() => Projeto, (projeto) => projeto.autor)
  projetosAutor: Projeto[];

  @OneToMany(() => Avaliacao, (avaliacao) => avaliacao.usuario)
  avaliacoes: Avaliacao[];

  @OneToMany(() => Favorito, (favorito) => favorito.usuario)
  favoritos: Favorito[];

  @OneToMany(() => Arquivo, (arquivo) => arquivo.usuario)
  arquivos: Arquivo[];

  @OneToOne(() => Arquivo, { nullable: true })
  @JoinColumn({ name: 'imagem_perfil_id' })
  imagemPerfil: Arquivo;
}