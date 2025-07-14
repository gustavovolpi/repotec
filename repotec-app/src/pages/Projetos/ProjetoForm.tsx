import Select, { SingleValue } from 'react-select';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Projeto, TipoProjeto, TipoProjetoOption, tipoProjetoOptions } from '../../types/projeto.types';
import { projetosService } from '../../services/projetos.service';
import TagSelect from '../../components/TagSelect/TagSelect';
import FileUpload from '../../components/FileUpload/FileUpload';
import { FileItem } from '../../types/file-item';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface ProjetoFormProps {
  projeto?: Projeto;
  onSave: () => void;
}

export default function ProjetoForm({ projeto, onSave }: ProjetoFormProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState(projeto?.titulo || '');
  const [descricao, setDescricao] = useState(projeto?.descricao || '');
  const [semestre, setSemestre] = useState(projeto?.semestre || '');
  const [tipoProjeto, setTipoProjeto] = useState<TipoProjeto>(projeto?.tipoProjeto || TipoProjeto.OUTROS);
  const [selectedTags, setSelectedTags] = useState<string[]>(projeto?.tags?.map(t => t.nome) || []);
  const [professorOrientador, setProfessorOrientador] = useState(projeto?.professorOrientador || '');
  const [autorArquivos, setAutorArquivos] = useState(projeto?.autorArquivos || '');
  const [files, setFiles] = useState<FileItem[]>(projeto?.arquivos || []);
  const [autorizacaoUpload, setAutorizacaoUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      carregarProjeto();
    }
  }, [id]);

  const carregarProjeto = async () => {
    try {
      const projeto = await projetosService.obterProjeto(Number(id));
      setTitulo(projeto.titulo);
      setDescricao(projeto.descricao);
      setSemestre(projeto.semestre);
      setTipoProjeto(projeto.tipoProjeto);
      setSelectedTags(projeto.tags.map(tag => tag.nome));
      setProfessorOrientador(projeto.professorOrientador || '');
      setAutorArquivos(projeto.autorArquivos || '');

      // Mapeia os arquivos do projeto para o formato FileItem
      const arquivosMapeados = projeto.arquivos.map(arquivo => ({
        id: arquivo.id,
        nome: arquivo.nome,
        url: arquivo.url
      }));
      setFiles(arquivosMapeados);
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
      setError('Erro ao carregar projeto');
    }
  };

  const handleFilesAdded = (newFiles: FileItem[]) => {
    setFiles(currentFiles => {
      // Filtra apenas os novos arquivos que não existem no estado atual
      const uniqueNewFiles = newFiles.filter(newFile =>
        !currentFiles.some(existingFile =>
          existingFile.nome === newFile.nome &&
          (!existingFile.id || existingFile.id === newFile.id)
        )
      );
      return [...currentFiles, ...uniqueNewFiles];
    });
    setAutorizacaoUpload(false);
  };

  const handleFileRemoved = (removedFile: FileItem) => {
    setFiles(currentFiles => currentFiles.filter(file => file !== removedFile));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length > 0 && !autorizacaoUpload) {
      setError('É necessário declarar que você possui autorização para upload dos arquivos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const projetoData = {
        titulo,
        descricao,
        semestre,
        tipoProjeto,
        tags: selectedTags,
        professorOrientador,
        autorArquivos
      };

      let projetoId: number;

      if (id) {
        const projetoAtualizado = await projetosService.atualizarProjeto(Number(id), projetoData);
        projetoId = projetoAtualizado.id!;
      } else {
        const novoProjeto = await projetosService.criarProjeto(projetoData);
        projetoId = novoProjeto.id!;
      }

      // Upload de arquivos
      const novosArquivos = files.filter(file => file.file && !file.id);
      if (novosArquivos.length > 0) {
        const formData = new FormData();
        novosArquivos.forEach(file => {
          if (file.file) {
            formData.append('files', file.file);
          }
        });
        try {
          await projetosService.uploadArquivos(projetoId, formData);
        } catch (error: unknown) {
          const apiError = error as ApiError;
          setError(apiError.response?.data?.message || 'Erro ao fazer upload dos arquivos');
          return;
        }
      }

      onSave();
      navigate(`/projetos/${projetoId}`);
    } catch (error: unknown) {
      console.error('Erro ao salvar projeto:', error);
      const apiError = error as ApiError;
      setError(apiError.response?.data?.message || 'Erro ao salvar projeto. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              Voltar
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {id ? 'Editar Projeto' : 'Novo Projeto'}
            </h2>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coluna da esquerda - Informações do projeto */}
            <div className="space-y-6">
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                  Título
                </label>
                <input
                  type="text"
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  id="descricao"
                  rows={4}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="semestre" className="block text-sm font-medium text-gray-700">
                  Semestre
                </label>
                <input
                  type="text"
                  id="semestre"
                  value={semestre}
                  onChange={(e) => setSemestre(e.target.value)}
                  placeholder="Ex: 2024.1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="professorOrientador" className="block text-sm font-medium text-gray-700">
                  Professor Orientador
                </label>
                <input
                  type="text"
                  id="professorOrientador"
                  value={professorOrientador}
                  onChange={(e) => setProfessorOrientador(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="autor" className="block text-sm font-medium text-gray-700">
                  Autor dos Arquivos
                </label>
                <input
                  type="text"
                  id="autor"
                  value={autorArquivos}
                  onChange={(e) => setAutorArquivos(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <TagSelect
                  value={selectedTags}
                  onChange={setSelectedTags}
                  className="mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="tipoProjeto"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tipo do Projeto
                </label>
                <Select<TipoProjetoOption>
                  className="mt-1"
                  classNamePrefix="select"
                  value={tipoProjetoOptions.find((opt) => opt.value === tipoProjeto)}
                  isDisabled={false}
                  isSearchable={false}
                  name="tipoProjeto"
                  onChange={(selectedOption: SingleValue<TipoProjetoOption>) => {
                    if (selectedOption) {
                      setTipoProjeto(selectedOption.value);
                    }
                  }}
                  options={tipoProjetoOptions}
                />
              </div>
            </div>

            {/* Coluna da direita - Arquivos */}
            <div className="space-y-6" id="panel-arquivos">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Arquivos do Projeto</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Adicione os arquivos relacionados ao projeto. Você pode arrastar e soltar os arquivos ou clicar para selecionar.
                </p>

                {files.length > 0 && (
                  <div className="mt-4">
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={autorizacaoUpload}
                        onChange={(e) => setAutorizacaoUpload(e.target.checked)}
                        className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        required={files.length > 0}
                      />
                      <span className="text-sm text-gray-700">
                        Declaro que obtive autorização do autor deste trabalho para realizar o upload e disponibilizá-lo neste repositório.
                      </span>
                    </label>
                  </div>
                )}

                <div className="mt-4" id="panel-arquivos-upload">
                  <FileUpload
                    files={files}
                    onFilesAdded={handleFilesAdded}
                    onFileRemoved={handleFileRemoved}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 