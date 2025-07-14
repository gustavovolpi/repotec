import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImagemPerfilToUsuario1710000000010
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE usuarios
            ADD COLUMN imagem_perfil_id integer,
            ADD CONSTRAINT fk_imagem_perfil
            FOREIGN KEY (imagem_perfil_id)
            REFERENCES arquivos(id)
            ON DELETE SET NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE usuarios
            DROP CONSTRAINT fk_imagem_perfil,
            DROP COLUMN imagem_perfil_id
        `);
  }
}
