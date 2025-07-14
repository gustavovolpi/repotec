import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCascadeDeleteToArquivos1710000000011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove a chave estrangeira existente
    await queryRunner.query(`
      ALTER TABLE arquivos
      DROP FOREIGN KEY arquivos_ibfk_2;
    `);

    // Adiciona a nova chave estrangeira com ON DELETE CASCADE
    await queryRunner.query(`
      ALTER TABLE arquivos
      ADD CONSTRAINT arquivos_ibfk_2
      FOREIGN KEY (usuario_id)
      REFERENCES usuarios(id)
      ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove a chave estrangeira com CASCADE
    await queryRunner.query(`
      ALTER TABLE arquivos
      DROP FOREIGN KEY arquivos_ibfk_2;
    `);

    // Restaura a chave estrangeira original
    await queryRunner.query(`
      ALTER TABLE arquivos
      ADD CONSTRAINT arquivos_ibfk_2
      FOREIGN KEY (usuario_id)
      REFERENCES usuarios(id);
    `);
  }
} 