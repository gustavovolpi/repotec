import { MigrationInterface, QueryRunner } from 'typeorm';
import { TipoProjeto } from '../projetos/projeto.entity';

export class SeedProjetos1710000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Primeiro, vamos garantir que temos usuários para associar aos projetos
    await queryRunner.query(`
      INSERT IGNORE INTO usuarios (nome, email, senha, tipo)
      VALUES 
        ('Professor Silva', 'silva@repotec.com', '$2b$10$zGR4Lk2aOScG0MzN1bZ1qOxoJ9VAkgvhE9kKxF8FjXGlDuZhbQN6q', 'professor'),
        ('Aluno João', 'joao@repotec.com', '$2b$10$zGR4Lk2aOScG0MzN1bZ1qOxoJ9VAkgvhE9kKxF8FjXGlDuZhbQN6q', 'aluno'),
        ('Aluna Maria', 'maria@repotec.com', '$2b$10$zGR4Lk2aOScG0MzN1bZ1qOxoJ9VAkgvhE9kKxF8FjXGlDuZhbQN6q', 'aluno');
    `);

    // Inserir algumas tags comuns
    await queryRunner.query(`
      INSERT IGNORE INTO tags (nome)
      VALUES 
        ('React'),
        ('Node.js'),
        ('TypeScript'),
        ('Java'),
        ('Python'),
        ('Machine Learning'),
        ('Web');
    `);

    // Inserir projetos de exemplo
    await queryRunner.query(`
      INSERT INTO projetos (
        titulo, 
        descricao, 
        autor_id,
        professor_id,
        tipo_projeto,
        semestre,
        data_criacao,
        data_atualizacao
      )
      SELECT 
        'Sistema de Gestão Acadêmica',
        'Desenvolvimento de um sistema web para gestão acadêmica utilizando React e Node.js',
        (SELECT id FROM usuarios WHERE email = 'joao@repotec.com'),
        (SELECT id FROM usuarios WHERE email = 'silva@repotec.com'),
        '${TipoProjeto.TCC}',
        '2024.1',
        NOW(),
        NOW()
      FROM dual
      WHERE NOT EXISTS (SELECT 1 FROM projetos WHERE titulo = 'Sistema de Gestão Acadêmica')
      UNION ALL
      SELECT 
        'Análise de Dados Educacionais',
        'Estudo sobre o desempenho acadêmico utilizando técnicas de machine learning',
        (SELECT id FROM usuarios WHERE email = 'maria@repotec.com'),
        (SELECT id FROM usuarios WHERE email = 'silva@repotec.com'),
        '${TipoProjeto.ARTIGO}',
        '2024.1',
        NOW(),
        NOW()
      FROM dual
      WHERE NOT EXISTS (SELECT 1 FROM projetos WHERE titulo = 'Análise de Dados Educacionais')
      UNION ALL
      SELECT 
        'API REST para E-commerce',
        'Desenvolvimento de uma API REST para sistema de e-commerce usando Node.js',
        (SELECT id FROM usuarios WHERE email = 'joao@repotec.com'),
        (SELECT id FROM usuarios WHERE email = 'silva@repotec.com'),
        '${TipoProjeto.OUTROS}',
        '2023.2',
        NOW(),
        NOW()
      FROM dual
      WHERE NOT EXISTS (SELECT 1 FROM projetos WHERE titulo = 'API REST para E-commerce');
    `);

    // Associar tags aos projetos
    await queryRunner.query(`
      INSERT INTO projeto_tags (projeto_id, tag_id)
      SELECT 
        p.id,
        t.id
      FROM projetos p
      CROSS JOIN tags t
      WHERE p.titulo = 'Sistema de Gestão Acadêmica'
      AND t.nome IN ('React', 'Node.js', 'TypeScript', 'Web')
      UNION ALL
      SELECT 
        p.id,
        t.id
      FROM projetos p
      CROSS JOIN tags t
      WHERE p.titulo = 'Análise de Dados Educacionais'
      AND t.nome IN ('Python', 'Machine Learning')
      UNION ALL
      SELECT 
        p.id,
        t.id
      FROM projetos p
      CROSS JOIN tags t
      WHERE p.titulo = 'API REST para E-commerce'
      AND t.nome IN ('Node.js', 'TypeScript');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Limpar as associações de tags
    await queryRunner.query(`DELETE FROM projeto_tags`);
    
    // Remover os projetos
    await queryRunner.query(`
      DELETE FROM projetos 
      WHERE titulo IN (
        'Sistema de Gestão Acadêmica',
        'Análise de Dados Educacionais',
        'API REST para E-commerce'
      )
    `);

    // Remover as tags
    await queryRunner.query(`
      DELETE FROM tags 
      WHERE nome IN (
        'React',
        'Node.js',
        'TypeScript',
        'Java',
        'Python',
        'Machine Learning',
        'Web'
      )
    `);

    // Remover os usuários de exemplo
    await queryRunner.query(`
      DELETE FROM usuarios 
      WHERE email IN (
        'silva@repotec.com',
        'joao@repotec.com',
        'maria@repotec.com'
      )
    `);
  }
}
