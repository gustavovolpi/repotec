import { useState, useEffect } from 'react';
import { Usuario, usuariosService } from '../../services/usuarios.service';
import { authService } from '../../services/auth.service';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [tipo, setTipo] = useState<'aluno' | 'professor' | 'admin' | ''>('');
  const [nome, setNome] = useState('');
  const user = authService.getCurrentUser();
  const isAdmin = user?.tipo === 'admin';

  const buscarUsuarios = async () => {
    try {
      const response = await usuariosService.listarUsuarios({
        tipo: tipo || undefined,
        nome: nome || undefined,
        pagina,
        limite: 10
      });
      setUsuarios(response.dados);
      setTotalPaginas(Math.ceil(response.meta.total / 10));
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleDelete = async (id: number, nomeUsuario: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${nomeUsuario}?`)) {
      try {
        await usuariosService.excluirUsuario(id);
        buscarUsuarios(); // Recarrega a lista após excluir
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir usuário. Verifique se não é um administrador.');
      }
    }
  };

  useEffect(() => {
    buscarUsuarios();
  }, [pagina]);

  const handleSearch = () => {
    setPagina(1);
    buscarUsuarios();
  };

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filtros */}
        <div className="bg-white shadow sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  id="nome"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                  Tipo
                </label>
                <select
                  id="tipo"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as 'aluno' | 'professor' | 'admin' | '')}
                >
                  <option value="">Todos</option>
                  <option value="aluno">Aluno</option>
                  <option value="professor">Professor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Usuários */}
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {usuarios.map((usuario) => (
              <li key={usuario.id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {usuario.nome}
                    </h3>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        {usuario.email}
                      </div>
                    </div>
                  </div>
                  {isAdmin && usuario.tipo !== 'admin' && (
                    <button
                      onClick={() => handleDelete(usuario.id, usuario.nome)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="mt-6 flex justify-center">
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