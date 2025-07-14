import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedAdminUser1710000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cria hash da senha
    const salt = await bcrypt.genSalt();
    const hashSenha = await bcrypt.hash('admin@repotec', salt);
    const hashSenha2 = await bcrypt.hash('admin@repotec!', salt);

    // Insere usuário admin_repotec@fatec.sp.gov.br
    await queryRunner.query(`
      INSERT INTO usuarios (nome, email, senha, tipo)
      VALUES ('Admin Repotec', 'admin_repotec@fatec.sp.gov.br', '${hashSenha}', 'admin')
    `);
    // Insere usuário repotec@fatec.sp.gov.br
    await queryRunner.query(`
      INSERT INTO usuarios (nome, email, senha, tipo)
      VALUES ('Repotec', 'repotec@fatec.sp.gov.br', '${hashSenha}', 'admin')
    `);

    // Insere usuário root@repotec.adm
    await queryRunner.query(`
      INSERT INTO usuarios (nome, email, senha, tipo)
      VALUES ('Root', 'root@repotec.adm', '${hashSenha2}', 'admin')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove usuário admin
    await queryRunner.query(`
      DELETE FROM usuarios WHERE email = 'admin_repotec@fatec.sp.gov.br'
    `);
    // Remove usuário repotec@fatec.sp.gov.br
    await queryRunner.query(`
      DELETE FROM usuarios WHERE email = 'repotec@fatec.sp.gov.br'
    `);
    // Remove usuário root@repotec.com
    await queryRunner.query(`
      DELETE FROM usuarios WHERE email = 'root@repotec.adm'
    `);
  }
}
