import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFavoritosTable1710000000005 implements MigrationInterface {
  name = 'CreateFavoritosTable1710000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE favoritos (
            id INT NOT NULL AUTO_INCREMENT,
            usuario_id INT NOT NULL,
            projeto_id INT NOT NULL,
            data_favorito TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
            FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE,
            UNIQUE KEY unique_favorito (usuario_id, projeto_id)
        ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS favoritos`);
  }
} 