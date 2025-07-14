import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Projeto } from '../projetos/projeto.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nome: string;

  @ManyToMany(() => Projeto)
  projetos: Projeto[];
}
