import { useState, useEffect } from 'react';
import { authService } from '../../services/auth.service';
import { TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

interface DominioEmail {
    id: number;
    dominio: string;
    ativo: boolean;
}

export default function Dominios() {
    const [dominios, setDominios] = useState<DominioEmail[]>([]);
    const [novoDominio, setNovoDominio] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const user = authService.getCurrentUser();
    const isAdmin = user?.tipo === 'admin';

    const buscarDominios = async () => {
        try {
            const response = await api.get('/dominios-email');
            setDominios(response.data);
        } catch (error) {
            console.error('Erro ao buscar domínios:', error);
            setError('Erro ao carregar domínios');
        }
    };

    const handleAdicionarDominio = async () => {
        if (!novoDominio) return;

        try {
            setLoading(true);
            setError('');
            await api.post('/dominios-email', { dominio: novoDominio });
            setNovoDominio('');
            buscarDominios();
        } catch (error) {
            console.error('Erro ao adicionar domínio:', error);
            setError('Erro ao adicionar domínio');
        } finally {
            setLoading(false);
        }
    };

    const handleAtivarDominio = async (id: number) => {
        try {
            await api.put(`/dominios-email/${id}/ativar`);
            buscarDominios();
        } catch (error) {
            console.error('Erro ao ativar domínio:', error);
            setError('Erro ao ativar domínio');
        }
    };

    const handleDesativarDominio = async (id: number) => {
        try {
            await api.put(`/dominios-email/${id}/desativar`);
            buscarDominios();
        } catch (error) {
            console.error('Erro ao desativar domínio:', error);
            setError('Erro ao desativar domínio');
        }
    };

    useEffect(() => {
        if (isAdmin) {
            buscarDominios();
        }
    }, [isAdmin]);

    if (!isAdmin) {
        return (
            <div className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Acesso Negado</h1>
                        <p className="mt-2 text-sm text-gray-600">Você não tem permissão para acessar esta página.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Domínios de Email</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Gerencie os domínios de email permitidos para cadastro de usuários.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 rounded-md bg-red-50 p-4">
                        <div className="text-sm text-red-700">{error}</div>
                    </div>
                )}

                {/* Formulário de Adição */}
                <div className="mt-6 bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="dominio" className="block text-sm font-medium text-gray-700">
                                    Novo Domínio
                                </label>
                                <input
                                    type="text"
                                    id="dominio"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                    placeholder="exemplo.com"
                                    value={novoDominio}
                                    onChange={(e) => setNovoDominio(e.target.value)}
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={handleAdicionarDominio}
                                    disabled={loading || !novoDominio}
                                    className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {loading ? 'Adicionando...' : 'Adicionar Domínio'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de Domínios */}
                <div className="mt-8 bg-white shadow sm:rounded-lg">
                    <ul className="divide-y divide-gray-200">
                        {dominios.map((dominio) => (
                            <li key={dominio.id} className="px-4 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            {dominio.ativo ? (
                                                <CheckIcon className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <XMarkIcon className="h-5 w-5 text-red-500" />
                                            )}
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">{dominio.dominio}</p>
                                            <p className="text-sm text-gray-500">
                                                {dominio.ativo ? 'Ativo' : 'Inativo'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        {dominio.ativo ? (
                                            <button
                                                onClick={() => handleDesativarDominio(dominio.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <XMarkIcon className="h-5 w-5" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleAtivarDominio(dominio.id)}
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                <CheckIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
} 