import { useState, useEffect } from 'react';
import { Usuario, usuariosService } from '../../services/usuarios.service';

interface ProfessorSelectProps {
    value: Usuario | null;
    onChange: (professor: Usuario | null) => void;
    className?: string;
}

export default function ProfessorSelect({ value, onChange, className = '' }: ProfessorSelectProps) {
    const [professores, setProfessores] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const carregarProfessores = async () => {
            setLoading(true);
            try {
                const response = await usuariosService.listarProfessores();
                setProfessores(response.dados);
            } catch (error) {
                console.error('Erro ao carregar professores:', error);
            } finally {
                setLoading(false);
            }
        };

        carregarProfessores();
    }, []);

    return (
        <select
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${className}`}
            value={value?.id || ''}
            onChange={(e) => {
                const professor = professores.find(p => p.id === Number(e.target.value));
                onChange(professor || null);
            }}
            disabled={loading}
        >
            <option value="">Todos os professores</option>
            {professores.map((professor) => (
                <option key={professor.id} value={professor.id}>
                    {professor.nome}
                </option>
            ))}
        </select>
    );
} 