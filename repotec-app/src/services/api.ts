import axios, { AxiosError } from 'axios';
import { authService } from './auth.service';

// Definindo a URL base da API
const service_host = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ApiError {
  response?: {
    status: number;
    data: {
      message: string | string[];
    };
  };
  message: string;
}

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    tipo: 'aluno' | 'professor' | 'admin';
  };
}

// Métodos de autenticação
export const apiLogin = async (email: string, senha: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', { email, senha });
  return response.data;
};

export const apiRegistro = async (data: { email: string; senha: string; nome: string }): Promise<void> => {
  await api.post('/auth/registro', data);
};

export const apiVerificarToken = async (token: string): Promise<boolean> => {
  const response = await api.get('/auth/verificar-token', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.status === 200;
};

export const apiRenovarToken = async (token: string): Promise<string> => {
  const response = await api.post('/auth/renovar-token', null, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const apiRecuperarSenha = async (email: string): Promise<{ message: string }> => {
  const response = await api.post('/auth/recuperar-senha', { email });
  return response.data;
};

export const apiRedefinirSenha = async (token: string, novaSenha: string): Promise<{ message: string }> => {
  const response = await api.post('/auth/redefinir-senha', { token, password: novaSenha });
  return response.data;
};

export const apiValidarTokenRecuperacao = async (token: string): Promise<{ valido: boolean; message: string }> => {
  const response = await api.post('/auth/validar-token-recuperacao', { token });
  return response.data;
};

export const apiAvaliarProjeto = async (projetoId: number, data: {
  nota: number;
  comentario: string;
}): Promise<{ message: string }> => {
  const response = await api.post(`/avaliacoes/projeto/${projetoId}`, data);
  return response.data;
};

export const getImagemUrl = (url: string | undefined) => {
  if (!url) return '';
  // Se a URL já começar com http ou https, retorna ela mesma
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Se a URL já começar com /api, concatena diretamente com a URL base
  if (url.startsWith('/api/')) {
    return `${service_host}${url}`;
  }
  // Caso contrário, adiciona /api antes da URL
  return `${service_host}/api${url}`;
};

// console.log('API URL:', service_host);

const api = axios.create({
  baseURL: `${service_host}/api`,
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use((config) => {
  const token = authService.getToken(); // Usando o método do serviço para obter o token
  // console.log('Token sendo enviado:', token ? 'Token existe' : 'Token não existe');
  // console.log('URL da requisição:', config.url);
  // console.log('Método da requisição:', config.method);
  // console.log('Headers antes:', config.headers);
  
  if (token) {
    // Garantindo que os headers existam
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    
    // Se for uma requisição multipart/form-data, não sobrescrever o Content-Type
    if (config.headers['Content-Type'] !== 'multipart/form-data') {
      config.headers['Content-Type'] = 'application/json';
    }
    
    // console.log('Headers depois:', config.headers);
    // console.log('Cabeçalho de autorização:', config.headers.Authorization);
  } else {
    console.warn('Nenhum token encontrado para a requisição:', config.url);
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // console.log('Erro na requisição:', error.message);
    // console.log('URL da requisição:', originalRequest?.url);
    // console.log('Método da requisição:', originalRequest?.method);
    // console.log('Status do erro:', error.response?.status);
    // console.log('Resposta do erro:', error.response?.data);
    
    // Se o erro for 401 (Unauthorized) e não for uma tentativa de renovação de token
    if (error.response?.status === 401 && 
        originalRequest && 
        !originalRequest.url?.includes('renovar-token') &&
        !originalRequest.url?.includes('verificar-token')) {
      try {
        // console.log('Tentando renovar token após erro 401...');
        // Tenta renovar o token
        const tokenAtual = authService.getToken();
        if (!tokenAtual) {
          throw new Error('Token não encontrado');
        }
        
        const tokenRenovado = await authService.renewToken(tokenAtual);
        
        if (tokenRenovado) {
          // Se conseguiu renovar, refaz a requisição original
          const token = authService.getToken();
          // console.log('Novo token após renovação:', token ? 'Token existe' : 'Token não existe');
          
          if (token && originalRequest.headers) {
            // Atualiza o token no cabeçalho da requisição original
            originalRequest.headers.Authorization = `Bearer ${token}`;
            // console.log('Refazendo requisição com novo token:', originalRequest.url);
            
            // Para requisições de upload de arquivos, precisamos recriar o FormData
            if (originalRequest.data instanceof FormData) {
              // console.log('Recriando FormData para a nova requisição');
              const newFormData = new FormData();
              for (const pair of (originalRequest.data as FormData).entries()) {
                newFormData.append(pair[0], pair[1]);
              }
              originalRequest.data = newFormData;
            }
            
            // Cria uma nova instância do axios para evitar loop infinito
            const newAxiosInstance = axios.create({
              baseURL: `${service_host}/api`,
              headers: {
                'Authorization': `Bearer ${token}`,
                ...originalRequest.headers
              }
            });
            
            // Garantindo que o Content-Type seja mantido para multipart/form-data
            if (originalRequest.headers['Content-Type'] === 'multipart/form-data') {
              delete newAxiosInstance.defaults.headers['Content-Type'];
            }
            
            return newAxiosInstance(originalRequest);
          }
        }
      } catch (renewError) {
        console.error('Erro ao renovar token:', renewError);
        // Se não conseguir renovar o token, força o logout
        authService.logout();
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 