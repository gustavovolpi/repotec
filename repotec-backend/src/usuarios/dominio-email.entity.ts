import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('dominios_email')
export class DominioEmail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, unique: true })
  dominio: string;

  @Column({ default: true })
  ativo: boolean;

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
} 