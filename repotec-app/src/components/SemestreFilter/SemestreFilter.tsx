import AsyncSelect from 'react-select/async';
import { projetosService } from '../../services/projetos.service';

interface SemestreFilterProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

interface SemestreOption {
    value: string;
    label: string;
}

export default function SemestreFilter({ value, onChange, className = '' }: SemestreFilterProps) {
    const loadOptions = async (inputValue: string) => {
        try {
            const response = await projetosService.listarSemestres();
            return response.dados
                .filter(semestre =>
                    semestre.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map(semestre => ({
                    value: semestre,
                    label: semestre
                }));
        } catch (error) {
            console.error('Erro ao buscar semestres:', error);
            return [];
        }
    };

    const handleChange = (option: SemestreOption | null) => {
        onChange(option?.value || '');
    };

    const selectedOption = value ? { value, label: value } : null;

    return (
        <AsyncSelect
            cacheOptions
            defaultOptions
            value={selectedOption}
            onChange={handleChange}
            loadOptions={loadOptions}
            placeholder="Selecione um semestre..."
            noOptionsMessage={() => "Nenhum semestre encontrado"}
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