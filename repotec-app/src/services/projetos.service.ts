import api from './api';
import { ListagemPaginada } from '../types/listagem-paginada';
import { Projeto, TipoProjeto } from '../types/projeto.types';

interface BuscarProjetosParams {
  termo?: string;
  tags?: string[];
  tipoProjeto?: TipoProjeto;
  autorId?: number;
  pagina?: number;
  limite?: number;
  professorId?: number;
  semestre?: string;
}

interface CriarProjetoDto {
  titulo: string;
  descricao: string;
  semestre: string;
  tipoProjeto: TipoProjeto;
  tags: string[];
  professorId?: number;
}

class ProjetosService {
  async buscarProjetos(params: BuscarProjetosParams = {}): Promise<ListagemPaginada<Projeto>> {
    // Formata os parâmetros para a API
    const formattedParams = {
      ...params,
      tags: params.tags ? params.tags.join(',') : undefined
    };

    const response = await api.get('/projetos', { params: formattedParams });
    return response.data;
  }

  async obterProjeto(id: number): Promise<Projeto> {
    console.log('obterProjeto', id);
    // throw new Error('teste');
    if(!id) {
      throw new Error('ID do projeto não informado');
    }
    const response = await api.get(`/projetos/${id}`);
    return response.data;
  }

  async criarProjeto(projeto: CriarProjetoDto): Promise<Projeto> {
    const response = await api.post('/projetos', projeto);
    return response.data;
  }

  async atualizarProjeto(id: number, projeto: Partial<CriarProjetoDto>): Promise<Projeto> {
    const response = await api.put(`/projetos/${id}`, projeto);
    return response.data;
  }

  async excluirProjeto(id: number): Promise<void> {
    await api.delete(`/projetos/${id}`);
  }

  async listarSemestres(pagina: number = 1, limite: number = 10): Promise<ListagemPaginada<string>> {
    const response = await api.get('/projetos/semestres', {
      params: { pagina, limite }
    });
    return response.data;
  }

  async uploadArquivos(projetoId: number, formData: FormData): Promise<void> {
    try {
      await api.post(`/arquivos/upload/${projetoId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao fazer upload dos arquivos');
    }
  }

  async buscarTags(termo?: string): Promise<ListagemPaginada<string>> {
    const response = await api.get('/tags/buscar', { 
      params: { 
        termo,
        pagina: 1,
        limite: 10
      } 
    });
    return response.data;
  }

  async avaliarProjeto(id: number, avaliacao: { nota: number; comentario: string }) {
    console.log('Avaliando projeto:', id, avaliacao);
    const response = await api.post(`/avaliacoes/projeto/${id}`, avaliacao);
    return response.data;
  }
}

export const projetosService = new ProjetosService(); 