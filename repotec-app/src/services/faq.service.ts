import api from './api';

export interface FAQ {
  id: string;
  pergunta: string;
  resposta: string;
}

interface CriarFaqDto {
  pergunta: string;
  resposta: string;
}

class FaqService {
  async buscarFaqs(): Promise<FAQ[]> {
    const response = await api.get('/perguntas-frequentes');
    return response.data;
  }

  async criarFaq(faq: CriarFaqDto): Promise<FAQ> {
    const response = await api.post('/perguntas-frequentes', faq);
    return response.data;
  }

  async atualizarFaq(id: string, faq: CriarFaqDto): Promise<FAQ> {
    const response = await api.put(`/perguntas-frequentes/${id}`, faq);
    return response.data;
  }

  async excluirFaq(id: string): Promise<void> {
    await api.delete(`/perguntas-frequentes/${id}`);
  }
}

export const faqService = new FaqService(); 