import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/usuario.entity';

@Entity('password_reset_token')
export class PasswordResetToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;


  @ManyToOne(() => Usuario, (usuario) => usuario.id)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  // @Column({ name: 'usuario_id' })
  // usuario_id: number;

  // @ManyToOne(() => Usuario)
  // usuario: Usuario;

  @CreateDateColumn({ name: 'criado_em' })
  criado_em: Date;

  @Column({ default: false })
  usado: boolean;

  @Column({ name: 'expira_em' })
  expira_em: Date;
} 