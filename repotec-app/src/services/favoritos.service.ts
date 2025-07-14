import api from './api';

interface Favorito {
  id: number;
  projeto: {
    id: number;
    titulo: string;
    descricao: string;
    autor: {
      id: number;
      nome: string;
    };
    tags: Array<{
      id: number;
      nome: string;
    }>;
  };
  data_favorito: string;
}

class FavoritosService {
  async adicionarFavorito(projetoId: number): Promise<void> {
    await api.post(`/favoritos/${projetoId}`);
  }

  async removerFavorito(projetoId: number): Promise<void> {
    await api.delete(`/favoritos/${projetoId}`);
  }

  async listarFavoritos(): Promise<Favorito[]> {
    const response = await api.get('/favoritos');
    return response.data;
  }

  async verificarFavorito(projetoId: number): Promise<boolean> {
    try {
      const favoritos = await this.listarFavoritos();
      return favoritos.some(favorito => favorito.projeto.id === projetoId);
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
      return false;
    }
  }
}

export const favoritosService = new FavoritosService(); 