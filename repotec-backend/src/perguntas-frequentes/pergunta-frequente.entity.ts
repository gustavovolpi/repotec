import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('perguntas_frequentes')
export class PerguntaFrequente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pergunta: string;

  @Column('text')
  resposta: string;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'data_atualizacao' })
  dataAtualizacao: Date;
} 