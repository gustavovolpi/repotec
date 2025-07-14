import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Projeto } from '../projetos/projeto.entity';

@Entity('favoritos')
export class Favorito {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.favoritos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_id', referencedColumnName: 'id' })
  usuario: Usuario;

  @ManyToOne(() => Projeto, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projeto_id', referencedColumnName: 'id' })
  projeto: Projeto;

  @CreateDateColumn()
  data_favorito: Date;
} 