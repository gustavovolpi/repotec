import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorArquivosProjetos1710000000008 implements MigrationInterface {
  name = 'RefactorArquivosProjetos1710000000008';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar nova tabela de relacionamento
    await queryRunner.query(`
        CREATE TABLE arquivos_projetos (
            arquivo_id INT NOT NULL,
            projeto_id INT NOT NULL,
            PRIMARY KEY (arquivo_id, projeto_id),
            FOREIGN KEY (arquivo_id) REFERENCES arquivos(id) ON DELETE CASCADE,
            FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
    `);

    // Migrar dados existentes
    await queryRunner.query(`
        INSERT INTO arquivos_projetos (arquivo_id, projeto_id)
        SELECT id, projeto_id FROM arquivos WHERE projeto_id IS NOT NULL
    `);

    // Remover coluna projeto_id da tabela arquivos
    await queryRunner.query(`
        ALTER TABLE arquivos DROP FOREIGN KEY arquivos_ibfk_1
    `);

    await queryRunner.query(`
        ALTER TABLE arquivos DROP COLUMN projeto_id
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna projeto_id de volta
    await queryRunner.query(`
        ALTER TABLE arquivos ADD COLUMN projeto_id INT
    `);

    // Restaurar dados
    await queryRunner.query(`
        UPDATE arquivos a
        JOIN arquivos_projetos ap ON a.id = ap.arquivo_id
        SET a.projeto_id = ap.projeto_id
    `);

    // Adicionar foreign key
    await queryRunner.query(`
        ALTER TABLE arquivos
        ADD CONSTRAINT arquivos_ibfk_1
        FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
    `);

    // Remover tabela de relacionamento
    await queryRunner.query(`DROP TABLE IF EXISTS arquivos_projetos`);
  }
} 