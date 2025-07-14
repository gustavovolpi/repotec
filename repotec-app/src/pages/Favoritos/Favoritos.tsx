import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoritosService } from '../../services/favoritos.service';
import { Projeto, TipoProjeto, TipoProjetoOption, tipoProjetoOptions } from '../../types/projeto.types';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Usuario } from '../../services/usuarios.service';
import TagFilter from '../../components/TagFilter/TagFilter';
import PessoaFilter from '../../components/PessoaFilter/PessoaFilter';
import Select, { SingleValue } from 'react-select';

export default function Favoritos() {
    const [projetos, setProjetos] = useState<Projeto[]>([]);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [termo, setTermo] = useState('');
    const [tag, setTag] = useState('');
    const [tipoProjeto, setTipoProjeto] = useState<TipoProjeto | ''>('');
    const [professor, setProfessor] = useState<Usuario | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();

    const buscarFavoritos = async () => {
        try {
            const favoritos = await favoritosService.listarFavoritos();
            const projetosFavoritos = favoritos.map(favorito => ({
                id: favorito.projeto.id,
                titulo: favorito.projeto.titulo,
                descricao: favorito.projeto.descricao,
                autor: {
                    id: favorito.projeto.autor.id,
                    nome: favorito.projeto.autor.nome,
                    email: '',
                    tipo: 'aluno'
                },
                tags: favorito.projeto.tags,
                semestre: '',
                tipoProjeto: TipoProjeto.OUTROS,
                arquivos: [],
                reputacao: 0,
                professorOrientador: '',
                avaliacoes: []
            })) as Projeto[];

            // Aplicar filtros
            let projetosFiltrados = projetosFavoritos;

            if (termo) {
                projetosFiltrados = projetosFiltrados.filter(projeto =>
                    projeto.titulo.toLowerCase().includes(termo.toLowerCase()) ||
                    projeto.descricao.toLowerCase().includes(termo.toLowerCase())
                );
            }

            if (tag) {
                projetosFiltrados = projetosFiltrados.filter(projeto =>
                    projeto.tags.some(t => t.nome.toLowerCase() === tag.toLowerCase())
                );
            }

            if (tipoProjeto) {
                projetosFiltrados = projetosFiltrados.filter(projeto =>
                    projeto.tipoProjeto === tipoProjeto
                );
            }

            if (professor?.id) {
                projetosFiltrados = projetosFiltrados.filter(projeto =>
                    projeto.professorOrientador === professor.nome
                );
            }

            // Paginação
            const inicio = (pagina - 1) * 12;
            const fim = inicio + 12;
            const projetosPaginados = projetosFiltrados.slice(inicio, fim);

            setProjetos(projetosPaginados);
            setTotalPaginas(Math.ceil(projetosFiltrados.length / 12));
        } catch (error) {
            console.error('Erro ao buscar favoritos:', error);
        }
    };

    useEffect(() => {
        buscarFavoritos();
    }, [pagina, termo, tag, tipoProjeto, professor]);

    const handleSearch = () => {
        setPagina(1);
        buscarFavoritos();
    };

    return (
        <div className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Meus Favoritos</h1>
                    </div>
                </div>

                {/* Barra de Pesquisa */}
                <div className="mt-6 bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                                    placeholder="Buscar favoritos..."
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
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tag</label>
                                    <TagFilter
                                        value={tag || null}
                                        onChange={(value) => setTag(value || '')}
                                        className="mt-1 block w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tipo de Projeto</label>
                                    <Select<TipoProjetoOption>
                                        className="mt-1"
                                        classNamePrefix="select"
                                        value={tipoProjetoOptions.find((opt) => opt.value === tipoProjeto)}
                                        isDisabled={false}
                                        isSearchable={false}
                                        isClearable={true}
                                        onChange={(selectedOption: SingleValue<TipoProjetoOption>) => {
                                            if (selectedOption) {
                                                setTipoProjeto(selectedOption.value);
                                            } else {
                                                setTipoProjeto('');
                                            }
                                        }}
                                        options={tipoProjetoOptions}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Professor</label>
                                    <PessoaFilter
                                        value={professor}
                                        onChange={setProfessor}
                                        className="mt-1 block w-full"
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
                                    className="flex flex-col overflow-hidden rounded-lg bg-white shadow cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => navigate(`/projetos/${projeto.id}`)}
                                >
                                    <div className="flex-1 p-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                {projeto.titulo}
                                            </h3>
                                            <p className="text-sm text-gray-500">{projeto.semestre}</p>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                                            {projeto.descricao}
                                        </p>
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
                                    </div>
                                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>Aluno: {projeto.autor.nome}</span>
                                            <span>Professor: {projeto.professorOrientador || 'Não informado'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="mt-1 text-sm text-gray-500">Nenhum favorito encontrado</p>
                        </div>
                    )}
                </div>

                {/* Paginação */}
                {totalPaginas > 1 && (
                    <div className="mt-8 flex justify-center">
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            {Array.from({ length: totalPaginas }).map((_, idx) => {
                                const pageNumber = idx + 1;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => setPagina(pageNumber)}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${pagina === pageNumber
                                            ? 'z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                                            } ${idx === 0 ? 'rounded-l-md' : ''} ${idx === totalPaginas - 1 ? 'rounded-r-md' : ''
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
} 