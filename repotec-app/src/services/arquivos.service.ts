import api from './api';

class ArquivosService {
  async excluirArquivo(id: number): Promise<void> {
    console.log('Excluindo arquivo com ID:', id);
    await api.delete(`/arquivos/${id}`);
  }

  async uploadArquivos(projetoId: number, formData: FormData): Promise<void> {
    await api.post(`/arquivos/upload/${projetoId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async downloadArquivo(id: number, nomeArquivo: string): Promise<void> {
    console.log('[downloadArquivo] Baixando arquivo com ID:', id);
    try {
      const response = await api.get(`/arquivos/${id}/download`, {
        responseType: 'blob'
      });
      console.log('[downloadArquivo] Resposta do servidor:', response);
      // Criar URL do blob e iniciar download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', nomeArquivo);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('[downloadArquivo] Erro ao baixar arquivo:', error);
      console.error('Erro ao baixar arquivo:', error);
      throw error;
    }
  }
}

export const arquivosService = new ArquivosService(); 