import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projetosService } from '../../services/projetos.service';
import { avaliacoesService } from '../../services/avaliacoes.service';
import { favoritosService } from '../../services/favoritos.service';
import { Projeto } from '../../types/projeto.types';
import { PencilIcon, TrashIcon, ArrowLeftIcon, ArrowDownTrayIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { authService } from '../../services/auth.service';
import { arquivosService } from '../../services/arquivos.service';
import ProjetoForm from './ProjetoForm';
import AvaliacaoProjeto from '../../components/AvaliacaoProjeto/AvaliacaoProjeto';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { DocumentIcon } from '@heroicons/react/24/outline';
import { getImagemUrl } from '../../services/api';

export default function ProjetoDetalhe() {
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [avaliacaoUsuario, setAvaliacaoUsuario] = useState<{ nota: number; comentario: string } | null>(null);
  const [isFavorito, setIsFavorito] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const isAdmin = user?.tipo === 'admin';

  const carregarProjeto = useCallback(async () => {
    if (!user) {
      setError('Usuário não autenticado');
      setLoading(false);
      return;
    }

    try {
      const data = await projetosService.obterProjeto(Number(id));
      // console.log('Projeto carregado:', data);
      setProjeto(data);
      setLoading(false);
    } catch (error) {
      setError('Erro ao carregar o projeto');
      console.error('Erro:', error);
      setLoading(false);
    }
  }, [id, user]);

  const carregarAvaliacaoUsuario = useCallback(async () => {
    if (!user || !id) return;

    try {
      const avaliacao = await avaliacoesService.buscarAvaliacaoDoUsuario(Number(id));
      if (avaliacao) {
        setAvaliacaoUsuario({
          nota: avaliacao.nota,
          comentario: avaliacao.comentario || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar avaliação do usuário:', error);
    }
  }, [id, user]);

  const carregarFavorito = useCallback(async () => {
    if (!user || !id) return;

    try {
      const favorito = await favoritosService.verificarFavorito(Number(id));
      setIsFavorito(favorito);
    } catch (error) {
      console.error('Erro ao carregar favorito:', error);
    }
  }, [id, user]);

  useEffect(() => {
    carregarProjeto();
    carregarAvaliacaoUsuario();
    carregarFavorito();
  }, [id]);

  const handleDelete = useCallback(async () => {
    if (!projeto || !window.confirm('Tem certeza que deseja excluir este projeto?')) {
      return;
    }

    try {
      await projetosService.excluirProjeto(projeto.id);
      navigate(-1);
    } catch (error) {
      setError('Erro ao excluir o projeto');
      console.error('Erro:', error);
    }
  }, [projeto, navigate]);

  const handleSave = useCallback(() => {
    setIsEditing(false);
    if (id && Number(id)) {
      // Recarrega a página para atualizar os dados
      window.location.reload();
    } else {
      navigate(-1);
    }
  }, [id, navigate]);

  const handleDownload = async (arquivoId: number, nomeArquivo: string) => {
    try {
      await arquivosService.downloadArquivo(arquivoId, nomeArquivo);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      setError('Erro ao baixar arquivo. Tente novamente.');
    }
  };

  const handleAvaliacao = async (nota: number, comentario: string) => {
    try {
      await avaliacoesService.avaliarProjeto(Number(id), nota, comentario);
      // Recarrega o projeto e a avaliação do usuário
      await Promise.all([carregarProjeto(), carregarAvaliacaoUsuario()]);
    } catch (error) {
      console.error('Erro ao avaliar projeto:', error);
    }
  };

  const handleDeleteFile = async (arquivoId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este arquivo?')) {
      return;
    }

    try {
      await arquivosService.excluirArquivo(arquivoId);
      await carregarProjeto();
    } catch (error) {
      console.error('Erro ao excluir arquivo:', error);
      setError('Erro ao excluir arquivo. Tente novamente.');
    }
  };

  const handleFavorito = async () => {
    if (!user || !id) return;

    try {
      if (isFavorito) {
        await favoritosService.removerFavorito(Number(id));
      } else {
        await favoritosService.adicionarFavorito(Number(id));
      }
      setIsFavorito(!isFavorito);
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
      setError('Erro ao alterar favorito. Tente novamente.');
    }
  };

  const handleDeleteAvaliacao = async (avaliacaoId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
      return;
    }

    try {
      await avaliacoesService.excluirAvaliacao(avaliacaoId);
      await carregarProjeto();
    } catch (error) {
      console.error('Erro ao excluir avaliação:', error);
      setError('Erro ao excluir avaliação. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !projeto) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || 'Projeto não encontrado'}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-primary-600 hover:text-primary-500"
        >
          Voltar para projetos
        </button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              Voltar
            </button>
            <h2 className="mt-4 text-2xl font-bold leading-7 text-gray-900">
              {projeto?.id ? 'Editar Projeto' : 'Novo Projeto'}
            </h2>
          </div>

          {projeto && (
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <ProjetoForm
                  projeto={projeto}
                  onSave={handleSave}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Voltar
        </button>
        {/* Cabeçalho */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {projeto.titulo}
            </h2>
          </div>
          {isAdmin && (
            <div className="mt-4 flex md:ml-4 md:mt-0">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <PencilIcon className="h-5 w-5 mr-1" />
                Editar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="ml-3 inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
              >
                <TrashIcon className="h-5 w-5 mr-1" />
                Excluir
              </button>
            </div>
          )}
          {user && !isAdmin && (
            <div className="mt-4 flex md:ml-4 md:mt-0">
              <button
                type="button"
                onClick={handleFavorito}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                {isFavorito ? (
                  <>
                    <HeartIconSolid className="h-5 w-5 mr-1 text-red-500" />
                    Desfavoritar
                  </>
                ) : (
                  <>
                    <HeartIcon className="h-5 w-5 mr-1" />
                    Favoritar
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Descrição</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                  {projeto.descricao}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Professor Orientador</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {projeto.professorOrientador || "Não atribuído"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Autor dos Arquivos</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {projeto.autorArquivos || 'Não informado'}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Semestre</dt>
                <dd className="mt-1 text-sm text-gray-900">{projeto.semestre}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Tags</dt>
                <dd className="mt-1">
                  <div className="flex flex-wrap gap-2">
                    {projeto.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700"
                      >
                        {tag.nome}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Postado por</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <div className="flex items-center">
                    {projeto.autor.imagemPerfil?.url ? (
                      <img
                        src={getImagemUrl(projeto.autor.imagemPerfil.url)}
                        alt={`Foto de perfil de ${projeto.autor.nome}`}
                        className="h-8 w-8 rounded-full object-cover mr-2"
                      />
                    ) : null}
                    {projeto.autor.nome}
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Seção de Arquivos */}
        {projeto?.arquivos && projeto.arquivos.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Arquivos do Projeto</h3>
            <ul className="divide-y divide-gray-200">
              {projeto.arquivos.map((arquivo) => (
                <li key={arquivo.id} className="py-4 flex items-center justify-between hover:bg-gray-50 px-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DocumentIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {arquivo.nome}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => arquivo.id && handleDownload(arquivo.id, arquivo.nome)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
                      Download
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDeleteFile(arquivo.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <TrashIcon className="h-4 w-4 mr-1.5" />
                        Excluir
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Avaliação */}
        <div className="mt-8">
          <AvaliacaoProjeto
            nota={avaliacaoUsuario?.nota || 0}
            comentario={avaliacaoUsuario?.comentario || ''}
            onSubmit={handleAvaliacao}
          />
        </div>

        {/* Lista de Avaliações */}
        {projeto.avaliacoes && projeto.avaliacoes.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Avaliações</h3>
            <div className="space-y-4">
              {projeto.avaliacoes.map((avaliacao) => (
                <div key={avaliacao.id} className="bg-white shadow sm:rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIconSolid
                          key={i}
                          className={`h-5 w-5 ${i < avaliacao.nota ? 'text-yellow-400' : 'text-gray-200'
                            }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      {avaliacao.autor && (
                        <div className="flex items-center">
                          {avaliacao.autor.imagemPerfil?.url ? (
                            <img
                              src={getImagemUrl(avaliacao.autor.imagemPerfil.url)}
                              alt={`Foto de perfil de ${avaliacao.autor.nome}`}
                              className="h-6 w-6 rounded-full object-cover mr-2"
                            />
                          ) : null}
                          <span className="text-sm text-gray-500">{avaliacao.autor.nome}</span>
                        </div>
                      )}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDeleteAvaliacao(avaliacao.id)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  {avaliacao.comentario && (
                    <p className="mt-2 text-sm text-gray-700">{avaliacao.comentario}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 