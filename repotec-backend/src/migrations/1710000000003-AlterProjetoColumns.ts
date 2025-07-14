import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterProjetoColumns1710000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Altera a coluna semestre para permitir NULL
    await queryRunner.query(`
      ALTER TABLE projetos MODIFY COLUMN semestre VARCHAR(10) NULL;
    `);

    // Adiciona a coluna tipo_projeto como ENUM
    await queryRunner.query(`
      ALTER TABLE projetos 
      ADD COLUMN tipo_projeto ENUM('TCC', 'Artigo Científico', 'Outros') NOT NULL DEFAULT 'Outros';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove a coluna tipo_projeto
    await queryRunner.query(`
      ALTER TABLE projetos DROP COLUMN tipo_projeto;
    `);

    // Reverte a coluna semestre para NOT NULL
    await queryRunner.query(`
      ALTER TABLE projetos MODIFY COLUMN semestre VARCHAR(10) NOT NULL;
    `);
  }
} 