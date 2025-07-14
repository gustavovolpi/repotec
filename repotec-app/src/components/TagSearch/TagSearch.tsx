import AsyncSelect from 'react-select/async';
import { projetosService } from '../../services/projetos.service';

interface TagSearchProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

interface TagOption {
    value: string;
    label: string;
}

export default function TagSearch({ value, onChange, className = '' }: TagSearchProps) {
    const loadOptions = async (inputValue: string) => {
        try {
            const response = await projetosService.buscarTags(inputValue);
            return response.dados.map(tag => ({
                value: tag,
                label: tag
            }));
        } catch (error) {
            console.error('Erro ao buscar tags:', error);
            return [];
        }
    };

    const handleChange = (option: TagOption | null) => {
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
            placeholder="Selecione uma tag..."
            noOptionsMessage={() => "Nenhuma tag encontrada"}
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