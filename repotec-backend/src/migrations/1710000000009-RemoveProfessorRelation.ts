import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveProfessorRelation1710000000009 implements MigrationInterface {
  name = 'RemoveProfessorRelation1710000000009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Primeiro, vamos remover a foreign key da tabela projetos
    await queryRunner.query(`
      ALTER TABLE projetos DROP FOREIGN KEY projetos_ibfk_2
    `);

    // Remover a coluna professor_id
    await queryRunner.query(`
      ALTER TABLE projetos DROP COLUMN professor_id
    `);

    // Adicionar a nova coluna professor_orientador
    await queryRunner.query(`
      ALTER TABLE projetos 
      ADD COLUMN professor_orientador VARCHAR(255) NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover a coluna professor_orientador
    await queryRunner.query(`
      ALTER TABLE projetos DROP COLUMN professor_orientador
    `);

    // Adicionar a coluna professor_id de volta
    await queryRunner.query(`
      ALTER TABLE projetos 
      ADD COLUMN professor_id INT NULL
    `);

    // Adicionar a foreign key de volta
    await queryRunner.query(`
      ALTER TABLE projetos 
      ADD CONSTRAINT projetos_ibfk_2 
      FOREIGN KEY (professor_id) REFERENCES usuarios(id) ON DELETE SET NULL
    `);
  }
} 