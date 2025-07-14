import { useState, useEffect } from 'react';
import { projetosService } from '../../services/projetos.service';

interface SemestreSelectProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function SemestreSelect({ value, onChange, className = '' }: SemestreSelectProps) {
    const [semestres, setSemestres] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const carregarSemestres = async () => {
            setIsLoading(true);
            try {
                const response = await projetosService.listarSemestres();
                setSemestres(response.dados);
            } catch (error) {
                console.error('Erro ao carregar semestres:', error);
            } finally {
                setIsLoading(false);
            }
        };

        carregarSemestres();
    }, []);

    return (
        <div className="relative">
            <input
                type="text"
                list="semestres"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={className}
                placeholder="Digite ou selecione o semestre (ex: 2024/1)"
            />
            <datalist id="semestres">
                {semestres.map((semestre) => (
                    <option key={semestre} value={semestre} />
                ))}
            </datalist>
            {isLoading && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                </div>
            )}
        </div>
    );
} 