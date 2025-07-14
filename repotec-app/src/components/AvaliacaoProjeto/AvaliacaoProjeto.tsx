import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface AvaliacaoProjetoProps {
    nota: number;
    comentario: string;
    onSubmit: (nota: number, comentario: string) => void;
    disabled?: boolean;
}

export default function AvaliacaoProjeto({ nota: notaInicial = 0, comentario: comentarioInicial = '', onSubmit, disabled }: AvaliacaoProjetoProps) {
    const [nota, setNota] = useState(notaInicial);
    const [comentario, setComentario] = useState(comentarioInicial);
    const [hover, setHover] = useState(0);

    useEffect(() => {
        setNota(notaInicial);
        setComentario(comentarioInicial);
    }, [notaInicial, comentarioInicial]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(nota, comentario);
    };

    return (
        <div className="bg-white shadow sm:rounded-lg">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Avaliação do Projeto</h3>

                {/* Estrelas */}
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((estrela) => (
                        <button
                            key={estrela}
                            type="button"
                            disabled={disabled}
                            onClick={() => setNota(estrela)}
                            onMouseEnter={() => setHover(estrela)}
                            onMouseLeave={() => setHover(0)}
                            className="p-1 hover:scale-110 transition-transform"
                        >
                            {(hover || nota) >= estrela ? (
                                <StarIconSolid className="h-8 w-8 text-yellow-400" />
                            ) : (
                                <StarIcon className="h-8 w-8 text-gray-300" />
                            )}
                        </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                        {nota ? `${nota} estrelas` : 'Sem avaliação'}
                    </span>
                </div>

                {/* Comentário */}
                <div>
                    <label htmlFor="comentario" className="block text-sm font-medium text-gray-700">
                        Comentário
                    </label>
                    <textarea
                        id="comentario"
                        rows={4}
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        disabled={disabled}
                        placeholder="Deixe seu comentário sobre o projeto..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>

                {!disabled && (
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                        >
                            Enviar Avaliação
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
} 