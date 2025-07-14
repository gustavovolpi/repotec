import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCascadeDeleteToAvaliacoes1710000000012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove a chave estrangeira existente
    await queryRunner.query(`
      ALTER TABLE avaliacoes
      DROP FOREIGN KEY avaliacoes_ibfk_2;
    `);

    // Adiciona a nova chave estrangeira com ON DELETE CASCADE
    await queryRunner.query(`
      ALTER TABLE avaliacoes
      ADD CONSTRAINT avaliacoes_ibfk_2
      FOREIGN KEY (usuario_id)
      REFERENCES usuarios(id)
      ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove a chave estrangeira com CASCADE
    await queryRunner.query(`
      ALTER TABLE avaliacoes
      DROP FOREIGN KEY avaliacoes_ibfk_2;
    `);

    // Restaura a chave estrangeira original
    await queryRunner.query(`
      ALTER TABLE avaliacoes
      ADD CONSTRAINT avaliacoes_ibfk_2
      FOREIGN KEY (usuario_id)
      REFERENCES usuarios(id);
    `);
  }
} 