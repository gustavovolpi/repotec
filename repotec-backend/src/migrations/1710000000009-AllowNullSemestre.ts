import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllowNullSemestre1710000000009 implements MigrationInterface {
  name = 'AllowNullSemestre1710000000009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE projetos
      MODIFY COLUMN semestre VARCHAR(7) NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE projetos
      MODIFY COLUMN semestre VARCHAR(7) NOT NULL
    `);
  }
} 