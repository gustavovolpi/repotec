import AsyncSelect from 'react-select/async';
import { Usuario, usuariosService } from '../../services/usuarios.service';

interface PessoaFilterProps {
    value: Usuario | null;
    onChange: (professor: Usuario | null) => void;
    className?: string;
    tipo?: 'aluno' | 'professor' | 'admin' | null;
    label?: string;
}

interface ProfessorOption {
    value: number;
    label: string;
}

export default function PessoaFilter({ value, onChange, className = '', tipo = 'professor', label }: PessoaFilterProps) {
    const loadOptions = async (inputValue: string) => {
        try {
            const response = await usuariosService.listarUsuarios({
                tipo,
                nome: inputValue,
                limite: 10
            });

            return response.dados.map(professor => ({
                value: professor.id,
                label: professor.nome
            }));
        } catch (error) {
            console.error(`Erro ao buscar ${label || tipo}s:`, error);
            return [];
        }
    };

    const handleChange = (option: ProfessorOption | null) => {
        if (!option) {
            onChange(null);
            return;
        }

        onChange({
            id: option.value,
            nome: option.label,
            email: '',
            tipo: 'professor'
        });
    };

    const selectedOption = value ? {
        value: value.id,
        label: value.nome
    } : null;

    return (
        <AsyncSelect
            cacheOptions
            defaultOptions
            value={selectedOption}
            onChange={handleChange}
            loadOptions={loadOptions}
            placeholder={`Selecione ${label || tipo}...`}
            noOptionsMessage={() => `Nenhum ${label || tipo} encontrado`}
            loadingMessage={() => "Carregando..."}
            isClearable
            className={className}
            classNamePrefix="react-select"
            theme={(theme) => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    primary: '#6B7280',
                    primary25: '#F3F4F6',
                    primary50: '#E5E7EB',
                },
            })}
        />
    );
} 