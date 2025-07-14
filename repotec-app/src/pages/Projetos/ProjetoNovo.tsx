import { useNavigate } from 'react-router-dom';
import ProjetoForm from './ProjetoForm';
import { TipoProjeto } from '../../types/projeto.types';

export default function ProjetoNovo() {
    const navigate = useNavigate();

    return (
        <div className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Novo Projeto</h1>
                </div>

                <ProjetoForm
                    projeto={{
                        id: 0,
                        titulo: '',
                        descricao: '',
                        semestre: '',
                        tags: [],
                        arquivos: [],
                        autor: { id: 0, nome: '' },
                        tipoProjeto: TipoProjeto.OUTROS,
                        reputacao: 0
                    }}
                    onSave={() => navigate('/')}
                />
            </div>
        </div>
    );
} 