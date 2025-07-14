import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1710000000000 implements MigrationInterface {
  name = 'CreateInitialSchema1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tabela de usuários
    await queryRunner.query(`
        CREATE TABLE usuarios (
            id INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            senha VARCHAR(255) NOT NULL,
            tipo ENUM('aluno', 'professor') NOT NULL,
            data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB
    `);

    // Tabela de projetos
    await queryRunner.query(`
        CREATE TABLE projetos (
            id INT NOT NULL AUTO_INCREMENT,
            titulo VARCHAR(255) NOT NULL,
            descricao TEXT NOT NULL,
            semestre VARCHAR(10) NOT NULL,
            reputacao FLOAT DEFAULT 0,
            autor_id INT NOT NULL,
            professor_id INT NOT NULL,
            data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
            FOREIGN KEY (professor_id) REFERENCES usuarios(id)
        ) ENGINE=InnoDB
    `);

    // Tabela de tags
    await queryRunner.query(`
        CREATE TABLE tags (
            id INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(50) NOT NULL UNIQUE,
            data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB
    `);

    // Tabela de relacionamento entre projetos e tags
    await queryRunner.query(`
        CREATE TABLE projeto_tags (
            projeto_id INT NOT NULL,
            tag_id INT NOT NULL,
            PRIMARY KEY (projeto_id, tag_id),
            FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
    `);

    // Tabela de arquivos
    await queryRunner.query(`
        CREATE TABLE arquivos (
            id INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(255) NOT NULL,
            caminho VARCHAR(255) NOT NULL,
            url VARCHAR(255),
            tamanho INT NOT NULL,
            content_type VARCHAR(100),
            projeto_id INT NOT NULL,
            usuario_id INT NOT NULL,
            data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            data_upload TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ) ENGINE=InnoDB
    `);

    // Tabela de avaliações
    await queryRunner.query(`
        CREATE TABLE avaliacoes (
            id INT NOT NULL AUTO_INCREMENT,
            nota FLOAT NOT NULL,
            comentario TEXT,
            projeto_id INT NOT NULL,
            usuario_id INT NOT NULL,
            data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            data_avaliacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
            UNIQUE KEY unique_avaliacao (projeto_id, usuario_id)
        ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS avaliacoes`);
    await queryRunner.query(`DROP TABLE IF EXISTS arquivos`);
    await queryRunner.query(`DROP TABLE IF EXISTS projeto_tags`);
    await queryRunner.query(`DROP TABLE IF EXISTS tags`);
    await queryRunner.query(`DROP TABLE IF EXISTS projetos`);
    await queryRunner.query(`DROP TABLE IF EXISTS usuarios`);
  }
}
