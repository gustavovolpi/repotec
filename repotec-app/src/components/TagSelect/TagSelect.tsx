import CreatableAsyncSelect from 'react-select/async-creatable';
import { projetosService } from '../../services/projetos.service';

interface TagSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

interface TagOption {
  value: string;
  label: string;
}

export default function TagSelect({ value, onChange, className = '' }: TagSelectProps) {
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

  const handleChange = (options: readonly TagOption[] | null) => {
    onChange(options?.map(option => option.value) || []);
  };

  const selectedOptions = value.map(tag => ({
    value: tag,
    label: tag
  }));

  return (
    <CreatableAsyncSelect
      isMulti
      cacheOptions
      defaultOptions
      value={selectedOptions}
      onChange={handleChange}
      loadOptions={loadOptions}
      placeholder="Selecione ou digite para criar tags..."
      noOptionsMessage={({ inputValue }) =>
        inputValue ? `Pressione enter para criar "${inputValue}"` : "Nenhuma tag encontrada"
      }
      formatCreateLabel={(inputValue) => `Criar tag "${inputValue}"`}
      loadingMessage={() => "Carregando..."}
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