import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUserTypeEnum1710000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Primeiro altera o tipo para permitir temporariamente qualquer string
    await queryRunner.query(`
      ALTER TABLE usuarios MODIFY COLUMN tipo VARCHAR(255);
    `);

    // Depois altera para o novo ENUM
    await queryRunner.query(`
      ALTER TABLE usuarios MODIFY COLUMN tipo ENUM('aluno', 'professor', 'admin') NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverte para o ENUM original
    await queryRunner.query(`
      ALTER TABLE usuarios MODIFY COLUMN tipo ENUM('aluno', 'professor') NOT NULL;
    `);
  }
} 