import AsyncSelect from 'react-select/async';
import { projetosService } from '../../services/projetos.service';

interface TagFilterProps {
    value: string | null;
    onChange: (value: string | null) => void;
    className?: string;
}

interface TagOption {
    value: string;
    label: string;
}

export default function TagFilter({ value, onChange, className = '' }: TagFilterProps) {
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
        onChange(option?.value || null);
    };

    const selectedOption = value ? { value, label: value } : null;

    return (
        <AsyncSelect
            cacheOptions
            defaultOptions={true}
            value={selectedOption}
            onChange={handleChange}
            loadOptions={loadOptions}
            placeholder="Pesquisar tags..."
            noOptionsMessage={({ inputValue }) =>
                inputValue ? "Nenhuma tag encontrada" : "Digite para pesquisar..."
            }
            loadingMessage={() => "Carregando..."}
            isClearable
            className={className}
            classNamePrefix="react-select"
            theme={(theme) => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    primary: '#6B7280', // gray-500
                    primary25: '#F3F4F6', // gray-100
                    primary50: '#E5E7EB', // gray-200
                },
            })}
        />
    );
} 