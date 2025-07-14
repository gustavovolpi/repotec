import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Projeto } from '../../types/projeto.types';
import { TipoProjeto, tipoProjetoOptions, TipoProjetoOption } from '../../types/projeto.types';
import { projetosService } from '../../services/projetos.service';
import TagFilter from '../../components/TagFilter/TagFilter';
import Select, { SingleValue } from 'react-select';
import { authService } from '../../services/auth.service';

export default function Dashboard() {
  const [termo, setTermo] = useState('');
  const [tag, setTag] = useState<string | null>(null);
  const [tipoProjeto, setTipoProjeto] = useState<TipoProjeto | null>(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const user = authService.getCurrentUser();
  const isAdmin = user?.tipo === 'admin';

  const navigate = useNavigate();

  const buscarProjetos = async () => {
    try {
      const params = {
        termo,
        tags: tag ? [tag] : undefined,
        tipoProjeto: tipoProjeto || undefined,
        pagina,
        limite: 12
      };

      const response = await projetosService.buscarProjetos(params);
      setProjetos(response.dados);
      setTotalPaginas(response.meta.ultimaPagina);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    }
  };

  useEffect(() => {
    buscarProjetos();
  }, [termo, tag, tipoProjeto, pagina]);

  const handleSearch = () => {
    setPagina(1);
    buscarProjetos();
  };

  return (
    <div className="min-h-full">
      <div className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {isAdmin && (
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-2xl font-semibold text-gray-900">Projetos</h1>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <Link
                  to="/projetos/novo"
                  className="block rounded-md bg-primary-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-primary-500"
                >
                  Novo Projeto
                </Link>
              </div>
            </div>
          )}

          {/* Barra de Pesquisa */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    placeholder="Buscar projetos..."
                    value={termo}
                    onChange={(e) => setTermo(e.target.value)}
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -mt-2 h-4 w-4 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <FunnelIcon className="-ml-0.5 h-5 w-5 text-gray-400" />
                  Filtros
                </button>
                <button
                  type="button"
                  onClick={handleSearch}
                  className="inline-flex justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Buscar
                </button>
              </div>

              {/* Filtros */}
              {showFilters && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tag</label>
                    <TagFilter
                      value={tag}
                      onChange={setTag}
                      className="mt-1 block w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Projeto</label>
                    <Select<TipoProjetoOption>
                      value={tipoProjetoOptions.find(opt => opt.value === tipoProjeto)}
                      onChange={(option: SingleValue<TipoProjetoOption>) => setTipoProjeto(option?.value || null)}
                      options={tipoProjetoOptions}
                      className="mt-1"
                      classNamePrefix="react-select"
                      isClearable
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lista de Projetos */}
          <div className="mt-8">
            {projetos.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {projetos.map((projeto) => (
                  <div
                    key={projeto.id}
                    onClick={() => navigate(`/projetos/${projeto.id}`)}
                    className="group flex flex-col overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-sm text-gray-600">{projeto.reputacao.toFixed(1)}</span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {/* {projeto.autorArquivos || 'Não informado'} */}
                          </p>
                        </div>
                      </div>
                      <h3 className="mt-2 text-lg font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                        {projeto.titulo}
                      </h3>
                      <p className="mt-2 flex-grow text-sm text-gray-500 line-clamp-3">
                        {projeto.descricao}
                      </p>

                      {/* Tags */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {projeto.tags.map((tag) => (
                          <span
                            key={`${projeto.id}_${tag.id}`}
                            className="inline-flex items-center rounded-full bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700"
                          >
                            {tag.nome}
                          </span>
                        ))}
                      </div>

                      {/* Link */}
                      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/projetos/${projeto.id}`);
                          }}
                          className="text-sm font-medium text-primary-600 hover:text-primary-500"
                        >
                          Ver detalhes
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">Nenhum projeto encontrado</p>
              </div>
            )}

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="mt-6 flex justify-center">
                <nav className="flex items-center gap-2">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPagina(p)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${p === pagina
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 