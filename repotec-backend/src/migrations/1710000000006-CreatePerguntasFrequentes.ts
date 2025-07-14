import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePerguntasFrequentes1710000000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE perguntas_frequentes (
        id SERIAL PRIMARY KEY,
        pergunta VARCHAR(255) NOT NULL,
        resposta TEXT NOT NULL,
        data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
        data_atualizacao TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE perguntas_frequentes;`);
  }
} 