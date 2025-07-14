import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPerguntasFrequentes1710000000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO perguntas_frequentes (pergunta, resposta) VALUES
      (
        'Como faço para buscar projetos no sistema?',
        'Para buscar projetos, você pode utilizar a barra de pesquisa na página de projetos. Você pode pesquisar por título, descrição ou tags. Além disso, existem filtros disponíveis para refinar sua busca por tipo de projeto, semestre ou autor.'
      ),
      (
        'Como marcar um projeto como favorito?',
        'Para marcar um projeto como favorito, acesse a página do projeto desejado e clique no ícone de coração. O projeto será adicionado à sua lista de favoritos e você poderá acessá-lo facilmente posteriormente.'
      ),
      (
        'Como posso avaliar um projeto?',
        'Para avaliar um projeto, acesse a página do projeto e procure pela seção de avaliações. Clique em "Avaliar" e preencha o formulário com sua nota e comentários. Sua avaliação ajudará outros usuários a conhecerem melhor o projeto.'
      ),
      (
        'Como acesso a lista de projetos favoritos?',
        'Para acessar sua lista de projetos favoritos, clique no menu de navegação e selecione "Favoritos". Lá você encontrará todos os projetos que você marcou como favorito, organizados por data de adição.'
      ),
      (
        'Como faço para baixar um projeto?',
        'Para baixar um projeto, acesse a página do projeto desejado e procure pela seção de arquivos. Clique no botão de download ao lado do arquivo que você deseja baixar. O arquivo será baixado para seu computador.'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM perguntas_frequentes 
      WHERE pergunta IN (
        'Como faço para buscar projetos no sistema?',
        'Como marcar um projeto como favorito?',
        'Como posso avaliar um projeto?',
        'Como acesso a lista de projetos favoritos?',
        'Como faço para baixar um projeto?'
      );
    `);
  }
} 