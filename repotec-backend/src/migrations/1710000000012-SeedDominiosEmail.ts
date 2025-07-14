import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDominiosEmail1710000000012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO dominios_email (dominio, ativo, data_criacao, data_atualizacao)
      VALUES 
        ('fatec.sp.gov.br', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('fatec.gov.br', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM dominios_email
      WHERE dominio IN ('fatec.sp.gov.br', 'fatec.gov.br')
    `);
  }
} 