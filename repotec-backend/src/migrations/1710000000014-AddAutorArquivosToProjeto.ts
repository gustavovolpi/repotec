import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAutorArquivosToProjeto1710000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE projetos 
      ADD COLUMN autor_arquivos VARCHAR(255) NULL AFTER autor_id
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE projetos 
      DROP COLUMN autor_arquivos
    `);
  }
} 