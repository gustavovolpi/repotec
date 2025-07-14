import api from './api';
import { authService } from './auth.service';
import { apiAvaliarProjeto } from './api';

export interface Avaliacao {
  id: number;
  nota: number;
  comentario: string;
  autor: { id: number; nome: string };
}

interface ApiError {
  response?: {
    status: number;
  };
}

class AvaliacoesService {
  async buscarAvaliacaoDoUsuario(projetoId: number): Promise<Avaliacao | null> {
    try {
      const response = await api.get(`/avaliacoes/projeto/${projetoId}`);
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async avaliarProjeto(projetoId: number, nota: number, comentario: string): Promise<void> {
    if (!authService.isAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    if (nota < 0 || nota > 10) {
      throw new Error('Nota deve estar entre 0 e 10');
    }

    try {
      await apiAvaliarProjeto(projetoId, { nota, comentario });
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao avaliar projeto');
    }
  }

  async excluirAvaliacao(avaliacaoId: number): Promise<void> {
    try {
      await api.delete(`/avaliacoes/${avaliacaoId}`);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Erro ao excluir avaliação');
    }
  }
}

export const avaliacoesService = new AvaliacoesService(); 