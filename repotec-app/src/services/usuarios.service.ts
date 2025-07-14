import api from './api';
import { ListagemPaginada } from '../types/listagem-paginada';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'aluno' | 'professor' | 'admin';
  imagemPerfil?: {
    id: number;
    url: string;
  };
}

interface ListarUsuariosParams {
  tipo?: 'aluno' | 'professor' | 'admin' | null;
  nome?: string;
  pagina?: number;
  limite?: number;
}

class UsuariosService {
  
  async listarProfessores() {
    const response = await api.get('/usuarios', { params: { tipo: 'professor' } });
    return response.data;
  }

  async listarUsuarios(params: ListarUsuariosParams = {}): Promise<ListagemPaginada<Usuario>> {
    const response = await api.get('/usuarios', { params });
    return response.data;
  }

  async obterUsuario(id: number): Promise<Usuario> {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  }

  async excluirUsuario(id: number): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  }

  async uploadImagemPerfil(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    
    await api.post('/usuarios/imagem-perfil', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async atualizarUsuario(id: number, dados: Partial<Usuario>): Promise<Usuario> {
    const response = await api.put(`/usuarios/${id}`, dados);
    return response.data;
  }
}

export const usuariosService = new UsuariosService(); 