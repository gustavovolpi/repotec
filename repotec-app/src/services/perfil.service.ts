import api from './api';
import { Usuario } from './usuarios.service';
import { authService } from './auth.service';

class PerfilService {
  async atualizarPerfil(dados: Partial<Usuario>): Promise<Usuario> {
    try {
      // console.log('Iniciando atualização de perfil');
      
      // Verifica se o usuário está autenticado
      const isAuth = authService.isAuthenticated();
      // console.log('Usuário está autenticado:', isAuth);
      
      if (!isAuth) {
        console.error('Usuário não está autenticado');
        throw new Error('Usuário não está autenticado');
      }
      
      const usuario = authService.getCurrentUser();
      // console.log('Usuário atual:', usuario ? usuario.nome : 'Não encontrado');
      
      if (!usuario || !usuario.id) {
        console.error('Usuário não encontrado ou ID inválido');
        throw new Error('Usuário não encontrado');
      }
      
      // console.log('Enviando requisição para atualizar perfil:', dados);
      const response = await api.post('/usuarios', dados);
      // console.log('Resposta da atualização:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  async uploadFotoPerfil(arquivo: File): Promise<Usuario> {
    try {
      console.log('Iniciando upload de foto de perfil');
      console.log('Arquivo recebido:', {
        nome: arquivo.name,
        tipo: arquivo.type,
        tamanho: arquivo.size
      });
      
      // Verifica se o usuário está autenticado
      const isAuth = authService.isAuthenticated();
      console.log('Usuário está autenticado:', isAuth);
      
      if (!isAuth) {
        console.error('Usuário não está autenticado');
        throw new Error('Usuário não está autenticado');
      }
      
      const formData = new FormData();
      formData.append('file', arquivo);
      
      // Verifica o conteúdo do FormData
      console.log('Conteúdo do FormData:');
      for (const pair of formData.entries()) {
        console.log('Campo:', pair[0]);
        console.log('Valor:', pair[1] instanceof File ? {
          nome: pair[1].name,
          tipo: pair[1].type,
          tamanho: pair[1].size
        } : pair[1]);
      }
      
      console.log('Enviando requisição para upload de foto');
      const response = await api.post('/usuarios/imagem-perfil', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Resposta do upload:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload da foto de perfil:', error);
      throw error;
    }
  }

  async alterarSenha(senhaAtual: string, novaSenha: string): Promise<void> {
    try {
      // Verifica se o usuário está autenticado
      if (!authService.isAuthenticated()) {
        throw new Error('Usuário não autenticado');
      }

      // Faz a requisição para alterar a senha usando o módulo api
      await api.post('/usuarios/alterar-senha', {
        senhaAtual,
        novaSenha,
      });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw error;
    }
  }
}

export const perfilService = new PerfilService(); 