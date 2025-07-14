import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { Projeto } from '../projetos/projeto.entity';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('arquivos')
export class Arquivo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nome: string;

  @Column({ length: 255 })
  caminho: string;

  @Column({ length: 255, nullable: true })
  url: string;

  @Column('int')
  tamanho: number;

  @Column({ length: 100, nullable: true, name: 'content_type' })
  contentType: string;

  @ManyToMany(() => Projeto, (projeto) => projeto.arquivos)
  projetos: Projeto[];

  @ManyToOne(() => Usuario, (usuario) => usuario.arquivos)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'data_criacao',
  })
  dataCriacao: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'data_upload',
  })
  dataUpload: Date;
}