import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Projeto } from '../projetos/projeto.entity';

@Entity('avaliacoes')
@Unique(['projeto', 'usuario'])
export class Avaliacao {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Projeto, (projeto) => projeto.avaliacoes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projeto_id' })
  projeto: Projeto;

  @ManyToOne(() => Usuario, (usuario) => usuario.avaliacoes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column('float')
  nota: number;

  @Column('text', { nullable: true })
  comentario: string | null;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'data_avaliacao' })
  dataAvaliacao: Date;
}
